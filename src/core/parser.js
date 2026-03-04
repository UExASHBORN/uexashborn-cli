import { GLOBAL_COMMANDS, CONTEXTUAL_COMMANDS } from "./grammar";

export function parse(tokens) {
  if (!tokens.length) {
    return { type: "EMPTY" };
  }

  const command = tokens[0];
  const args = tokens.slice(1);

  if (GLOBAL_COMMANDS.includes(command)) {
    return { type: "GLOBAL", command, args };
  }

  if (CONTEXTUAL_COMMANDS.includes(command)) {
    return { type: "CONTEXTUAL", command, args };
  }

  return { type: "UNKNOWN", command };
}
