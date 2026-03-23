import { setState, appState } from "./stateMachine";
import { cliPrint } from "../renderers/cliRenderer";
import { STATES } from "./constants";
import { clearScreen } from "../renderers/cliRenderer";
import { runScan } from "../simulations/scan";
import { runTrace } from "../simulations/trace";
import { runBreach } from "../simulations/breach";
import { SECTIONS } from "./constants";

export const commandHistory = [];

export let commandLock = false;

export function handleGlobalCommand(cmd) {

  commandHistory.push({
    command: cmd,
    args: [],
    time: new Date().toLocaleTimeString()
  });

  switch(cmd){

    case "help":
      cliPrint("----------");
      cliPrint("NAVIGATION");
      cliPrint("----------");
      cliPrint("open <section>     open a section");
      cliPrint("open <article>     open an article inside a section");
      cliPrint("back               return to previous level");
      cliPrint("root               return to root interface");
      cliPrint("");

      cliPrint("--------");
      cliPrint("COMMANDS");
      cliPrint("--------");
      cliPrint("help               show this help screen");
      cliPrint("clear              clear terminal output");
      cliPrint("history            show command history");
      cliPrint("version            show system version");
      cliPrint("time               display system time");
      cliPrint("status             show system state");
      cliPrint("exit               close the interface");
      cliPrint("");

      cliPrint("--------------");
      cliPrint("SECURITY DEMOS");
      cliPrint("--------------");
      cliPrint("scan <target>      simulate reconnaissance scan");
      cliPrint("trace <ip>         simulate network tracing");
      cliPrint("breach <target>    simulate breach analysis");
      cliPrint("");

      cliPrint("-----------");
      cliPrint("EXPERIMENTS");
      cliPrint("-----------");
      cliPrint("play <game>        start a game");
      cliPrint("ashborn            activate the Ashborn easter-egg");
      cliPrint("");

      cliPrint("--------");
      cliPrint("EXAMPLES");
      cliPrint("--------");
      cliPrint("open whoami");
      cliPrint("open soc");
      cliPrint("scan ssh-lab");
      cliPrint("play dino");

      break;

    case "clear":
      clearScreen();
      break;

    case "root":

      // If already at root → just re-render
      if (appState.current === STATES.INTRO) {
        clearScreen();
        setState(STATES.INTRO);
        return;
      }
    
      clearScreen();
      setState(STATES.INTRO);
      break;

    case "exit":
      setState(STATES.INTRO);
      break;

    case "version":
      cliPrint("UExASHBORN CLI v0.3");
      break;

    case "time":
      cliPrint(new Date().toLocaleTimeString());
      break;

    case "status":
      cliPrint(`State: ${appState.current}`);
      cliPrint(`Section: ${appState.payload}`);
      break;
      
    case "history": {

      if (commandHistory.length === 0) {
        cliPrint("No commands yet.");
        return;
      }
    
      cliPrint("Command History:");
      cliPrint("----------------");
    
      commandHistory.forEach((entry, index) => {
        const full = [entry.command, ...entry.args].join(" ");
        cliPrint(`${index + 1}. [${entry.time}] ${full}`);
      });
    
      return;
    }

    case "ashborn":
      console.log("Ashborn protocol activated.");
      document.body.classList.add("ashborn-flame");
      break;

    default:
      console.log("Unhandled command:",cmd);

  }

}

export function handleContextualCommand(command, args) {

  commandHistory.push({
    command,
    args,
    time: new Date().toLocaleTimeString()
  });

  switch (command) {

    case "back": {

    // 🚫 Do nothing if already at root
    if (appState.current === STATES.INTRO) {
      cliPrint("Cannot go back from here.", "error");
      return;
    }
  
    if (appState.current === STATES.SECTION_VIEW) {
      clearScreen();
      setState(STATES.INTRO);
      return;
    }
  
    if (appState.current === STATES.ARTICLE_VIEW) {
      clearScreen();
      setState(STATES.SECTION_VIEW, appState.payload.section);
      return;
    }
  
    if (appState.current === STATES.GAME_VIEW) {
      clearScreen();
      setState(STATES.SECTION_VIEW, "games");
      return;
    }
  
    break;
  }

    case "open": {

      const target = args[0];

      // open section
      if (SECTIONS.includes(target)) {

        // 🚫 Already in same section
        if (
          appState.current === STATES.SECTION_VIEW &&
          appState.payload === target
        ) {
          cliPrint(`Already in ${target}.`);
          return;
        }
      
        clearScreen();
      
        setState(STATES.SECTION_VIEW, target);
        return;
      }
    
      console.log("Unknown target:", target);
      break;
    }

    case "play":

      if (
        appState.current === STATES.SECTION_VIEW &&
        appState.payload === "games" &&
        args.length
      ) {
        clearScreen();

        setState(STATES.GAME_VIEW, args[0]);

      }

      break;

    case "list":

      console.log("Listing items...");
      break;

    case "scan": {
      const target = args[0] || "target";
      commandLock = true;

      runScan(target).then(() => {
        commandLock = false;
      });
    
      break;
    }

    case "trace": {

      const target = args[0] || "target";

      commandLock = true;

      runTrace(target).then(() => {
        commandLock = false;
      });
    
      break;
    }

    case "breach": {

      const target = args[0] || "target";

      commandLock = true;
        
      runBreach(target).then(() => {
        commandLock = false;
      });
    
      break;
    }

    default:

      console.log("Invalid contextual command");

  }
}