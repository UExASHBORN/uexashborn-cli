import { appState, setState } from "./stateMachine";
import { STATES } from "./constants";
import {
  handleGlobalCommand,
  handleContextualCommand
} from "./commandHandlers";
import { cliPrint } from "../renderers/cliRenderer";
import { CLI_COMMANDS } from "./commandRegistry";
import { getClosestCommand } from "../utils/cliUtils";

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
    const args = action.payload.args || [];

    logCommand(cmd, args);

    handleGlobalCommand(cmd);

    break;
  }

  case "CONTEXTUAL_COMMAND": {
    const { command, args } = action.payload;
    handleContextualCommand(command, args);
    break;
  }

  case "ERROR_UNKNOWN_COMMAND": {

    const cmd = action.payload.command;

    cliPrint(`Unknown command: ${cmd}`, "error");

    const suggestion = getClosestCommand(cmd);

    if (suggestion) {
      cliPrint(`Did you mean: ${suggestion} ?`);
    } else {
      cliPrint("Type 'help' to see available commands.");
    }

    break;
  }

  case "NO_OP":
    break;

  default:
    console.warn("Unknown action:", action);
  }
}


function logCommand(cmd, args = []) {

  const time = new Date().toLocaleTimeString();

  const full = [cmd, ...args].join(" ");

  cliPrint(`[${time}] command received: ${full}`);

}