import { appState, setState } from "./stateMachine";
import { STATES } from "./constants";
import {
  handleGlobalCommand,
  handleContextualCommand
} from "./commandHandlers";

export function dispatch(action) {
  switch (action.type) {

  case "INTRO_COMPLETE":
  setState(STATES.INTRO);
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
    handleGlobalCommand(cmd);
   break;
  }

  case "CONTEXTUAL_COMMAND": {
    const { command, args } = action.payload;
    handleContextualCommand(command, args);
    break;
  }

  case "ERROR_UNKNOWN_COMMAND":
    console.log(`Unknown command: ${action.payload.command}`);
    console.log("Type 'help' to see available commands.");
    break;

  case "NO_OP":
    break;

  default:
    console.warn("Unknown action:", action);
  }
}
