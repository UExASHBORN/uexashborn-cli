export const COMMANDS = {

  help: {
    type: "GLOBAL",
    args: 0,
    aliases: ["h"]
  },

  clear: {
    type: "GLOBAL",
    args: 0
  },

  home: {
    type: "GLOBAL",
    args: 0
  },

  about: {
    type: "GLOBAL",
    args: 0
  },

  research: {
    type: "GLOBAL",
    args: 0
  },

  letters: {
    type: "GLOBAL",
    args: 0
  },

  notes: {
    type: "GLOBAL",
    args: 0
  },

  games: {
    type: "GLOBAL",
    args: 0
  },

  open: {
    type: "CONTEXTUAL",
    args: 1
  },

  play: {
    type: "CONTEXTUAL",
    args: 1
  },

  back: {
    type: "CONTEXTUAL",
    args: 0
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