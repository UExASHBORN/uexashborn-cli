export function resolveCommand(parsed) {
  switch (parsed.type) {
    case "GLOBAL":
      return { type: "GLOBAL_COMMAND", payload: parsed };

    case "CONTEXTUAL":
      return { type: "CONTEXTUAL_COMMAND", payload: parsed };

    case "EMPTY":
      return { type: "NO_OP" };

    case "UNKNOWN":
      return { type: "ERROR_UNKNOWN_COMMAND", payload: parsed };

    default:
      return { type: "ERROR_UNKNOWN_COMMAND", payload: parsed };
  }
}
