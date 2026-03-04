import { appState, setState } from "./stateMachine";
import { STATES } from "./constants";

export function dispatch(action) {
  switch (action.type) {

  case "INTRO_COMPLETE":
  appState.current = STATES.BOOT;
  break;

  case "SET_MODE":
  appState.mode = action.payload;
  break;

  case "INIT": {
    const isMobile = /Mobi|Android/i.test(navigator.userAgent);

    if (isMobile) {
      appState.mode = "GUI";
    } else {
      appState.mode = "CLI";
    }

    setState(STATES.BOOT);
    break;
  }

  case "GLOBAL_COMMAND": {
    const cmd = action.payload.command;

    switch (cmd) {
      case "help":
        console.log("Showing help...");
        break;

      case "clear":
        console.clear();
        break;

      case "about":
      case "research":
      case "letters":
      case "notes":
      case "games":
        setState(STATES.SECTION_VIEW, cmd);
        break;

      case "exit":
        setState(STATES.INTRO);
        break;

      default:
        console.log("Unhandled global command:", cmd);
    }

    break;
  }

  case "CONTEXTUAL_COMMAND": {
    const { command, args } = action.payload;

    switch (command) {

      case "back":
        if (appState.current === STATES.SECTION_VIEW) {
          setState(STATES.INTRO);
        } else if (appState.current === STATES.ARTICLE_VIEW) {
          setState(STATES.SECTION_VIEW, appState.payload.section);
        } else if (appState.current === STATES.GAME_VIEW) {
          setState(STATES.SECTION_VIEW, "games");
        }
        break;

      case "open":
        if (appState.current === STATES.SECTION_VIEW && args.length) {
          setState(STATES.ARTICLE_VIEW, {
            section: appState.payload,   // current section
            slug: args[0],               // article id
          });
        }
        break;

      case "play":
        if (
          appState.current === STATES.SECTION_VIEW &&
          appState.payload === "games" &&
          args.length
        ) {
          setState(STATES.GAME_VIEW, args[0]);
        }
        break;

      case "list":
        console.log("Listing items...");
        break;

      default:
        console.log("Invalid contextual command in this state");
    }

    break;
  }

  case "ERROR_UNKNOWN_COMMAND":
    console.log("Unknown command:", action.payload.command);
    break;

  case "NO_OP":
    break;

  default:
    console.warn("Unknown action:", action);
  }
}
