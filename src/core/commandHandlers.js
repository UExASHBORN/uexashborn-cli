import { setState, appState } from "./stateMachine";
import { cliPrint } from "../renderers/cliRenderer";
import { STATES } from "./constants";
import { clearScreen } from "../utils/cliUtils";
import { loadArticle } from "./contentLoader";
import { runScan } from "../simulations/scan";
import { runTrace } from "../simulations/trace";
import { runBreach } from "../simulations/breach";



export let commandLock = false;

export function handleGlobalCommand(cmd) {

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
      const out = document.getElementById("cli-output");
      if(out) out.innerHTML = "";
      break;

    case "root":
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
      
    case "history":
      console.log("History command not yet connected to renderer.");
      break;

    case "ashborn":
      console.log("Ashborn protocol activated.");
      document.body.classList.add("ashborn-flame");
      break;

    default:
      console.log("Unhandled command:",cmd);

  }

}

export function handleContextualCommand(command, args) {

  switch (command) {

    case "back":
      clearScreen();

      if (appState.current === STATES.SECTION_VIEW) {
        setState(STATES.INTRO);
      }

      else if (appState.current === STATES.ARTICLE_VIEW) {
        setState(STATES.SECTION_VIEW, appState.payload.section);
      }

      else if (appState.current === STATES.GAME_VIEW) {
        setState(STATES.SECTION_VIEW, "games");
      }

      break;

    case "open": {

      const target = args[0];
      const sections = ["whoami", "soc", "games"];

      // open section
      if (sections.includes(target)) {
        clearScreen();

        if (target === "whoami") {

          setState(STATES.SECTION_VIEW, "whoami");

          clearScreen();

          loadArticle("whoami", "profile");

          return;
        }

        setState(STATES.SECTION_VIEW, target);
        return;
      }
    
      // open article inside section
      if (appState.current === STATES.SECTION_VIEW) {
      
        const section = appState.payload;
      
        clearScreen();
      
        loadArticle(section, target);
      
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