export const COMMANDS = {

  help: {
    type: "GLOBAL",
    minArgs: 0,
    maxArgs: 0,
    description: "show command list",
    aliases: ["h"]
  },

  clear: {
    type: "GLOBAL",
    minArgs: 0,
    maxArgs: 0,
    description: "clear terminal",
    aliases: ["cls"]
  },

  root: {
    type: "GLOBAL",
    minArgs: 0,
    maxArgs: 0,
    description: "return to root"
  },

  version: {
    type: "GLOBAL",
    minArgs: 0,
    maxArgs: 0,
    description: "show CLI version"
  },

  time: {
    type: "GLOBAL",
    minArgs: 0,
    maxArgs: 0,
    description: "show system time"
  },

  status: {
    type: "GLOBAL",
    minArgs: 0,
    maxArgs: 0,
    description: "show system status"
  },

  history: {
    type: "GLOBAL",
    minArgs: 0,
    maxArgs: 0,
    description: "show command history"
  },

  ashborn: {
    type: "GLOBAL",
    minArgs: 0,
    maxArgs: 0,
    description: "activate ashborn protocol"
  },

  exit: {
    type: "GLOBAL",
    minArgs: 0,
    maxArgs: 0,
    description: "exit context"
  },

  open: {
    type: "CONTEXTUAL",
    minArgs: 1,
    maxArgs: 1,
    description: "open section",
    aliases: ["cd"]
  },

  play: {
    type: "CONTEXTUAL",
    minArgs: 1,
    maxArgs: 1,
    description: "play game"
  },

  scan: {
    type: "CONTEXTUAL",
    minArgs: 1,
    maxArgs: 1,
    description: "scan target"
  },

  trace: {
    type: "CONTEXTUAL",
    minArgs: 1,
    maxArgs: 1,
    description: "trace network"
  },

  breach: {
    type: "CONTEXTUAL",
    minArgs: 1,
    maxArgs: 1,
    description: "attempt breach"
  },

  back: {
    type: "CONTEXTUAL",
    minArgs: 0,
    maxArgs: 0,
    description: "go back"
  }

};

export const CLI_COMMANDS = Object.keys(COMMANDS);


export function resolveCommand(parsed) {

  let cmd = parsed.command;

  // resolve aliases
  for (const key in COMMANDS) {
    const entry = COMMANDS[key];

    if (entry.aliases && entry.aliases.includes(cmd)) {
      cmd = key;
      break;
    }
  }

  const entry = COMMANDS[cmd];

  if (!entry) {
    return { type: "ERROR_UNKNOWN_COMMAND", payload: parsed };
  }

  const argCount = parsed.args.length;

  if (entry.minArgs !== undefined && argCount < entry.minArgs) {
    return { type: "ERROR_INVALID_ARGUMENTS", payload: parsed };
  }

  if (entry.maxArgs !== undefined && argCount > entry.maxArgs) {
    return { type: "ERROR_INVALID_ARGUMENTS", payload: parsed };
  }

  const resolved = {
    command: cmd,
    args: parsed.args
  };

  if (entry.type === "GLOBAL") {
    return { type: "GLOBAL_COMMAND", payload: resolved };
  }

  return { type: "CONTEXTUAL_COMMAND", payload: resolved };

}