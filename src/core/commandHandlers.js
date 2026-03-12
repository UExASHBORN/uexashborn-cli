import { setState, appState } from "./stateMachine";
import { STATES } from "./constants";
import { clearScreen } from "../utils/cliUtils";
import { loadArticle } from "./contentLoader";

export function handleGlobalCommand(cmd) {

  switch(cmd){

    case "help":
      console.log("Type 'help' to see available commands.");
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
      console.log("UExASHBORN CLI v0.3");
      break;

    case "time":
      console.log(new Date().toLocaleTimeString());
      break;

    case "status":
      console.log("State:", appState.current);
      console.log("Section:", appState.payload);
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

    default:

      console.log("Invalid contextual command");

  }
}