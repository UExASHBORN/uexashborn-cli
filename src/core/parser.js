import { COMMANDS } from "./commandRegistry";

export function parse(tokens) {

  if (!tokens.length) {
    return { type: "EMPTY" };
  }

  let command = tokens[0];
  const args = tokens.slice(1);

  for (const key in COMMANDS) {
    const entry = COMMANDS[key];

    if (entry.aliases && entry.aliases.includes(command)) {
      command = key;
    }
  }

  const commandDef = COMMANDS[command];

  if (!commandDef) {
    return { type: "UNKNOWN", command };
  }

  if (args.length < commandDef.args) {
    return { type: "INVALID_ARGS", command, args };
  }

  return {
    type: commandDef.type,
    command,
    args
  };

}