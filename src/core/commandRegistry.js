export const COMMANDS = {

  help: {
    type: "GLOBAL",
    args: 0,
    description: "show command list",
    aliases: ["h"]
  },

  clear: {
    type: "GLOBAL",
    args: 0,
    description: "clear terminal",
    aliases: ["cls"]
  },

  root: {
    type: "GLOBAL",
    args: 0,
    description: "return to root"
  },

  version: {
    type: "GLOBAL",
    args: 0,
    description: "show CLI version"
  },

  time: {
    type: "GLOBAL",
    args: 0,
    description: "show system time"
  },

  status: {
    type: "GLOBAL",
    args: 0,
    description: "show system status"
  },

  history: {
    type: "GLOBAL",
    args: 0,
    description: "show command history"
  },

  ashborn: {
    type: "GLOBAL",
    args: 0,
    description: "activate ashborn protocol"
  },

  exit: {
    type: "GLOBAL",
    args: 0,
    description: "exit context"
  },

  open: {
    type: "CONTEXTUAL",
    args: 1,
    description: "open section",
    aliases: ["cd"]
  },

  play: {
    type: "CONTEXTUAL",
    args: 1,
    description: "play game"
  },

  scan: {
    type: "CONTEXTUAL",
    args: 1,
    description: "scan target"
  },

  trace: {
    type: "CONTEXTUAL",
    args: 1,
    description: "trace network"
  },

  breach: {
    type: "CONTEXTUAL",
    args: 1,
    description: "attempt breach"
  },

  back: {
    type: "CONTEXTUAL",
    args: 0,
    description: "go back"
  }

};


export function resolveCommand(parsed) {

  const cmd = parsed.command;

  const entry = COMMANDS[cmd];

  if (!entry) {
    return { type: "ERROR_UNKNOWN_COMMAND", payload: parsed };
  }

  if (parsed.args.length < entry.args) {
    return { type: "ERROR_INVALID_ARGUMENTS", payload: parsed };
  }

  if (entry.type === "GLOBAL") {
    return { type: "GLOBAL_COMMAND", payload: parsed };
  }

  return { type: "CONTEXTUAL_COMMAND", payload: parsed };

}