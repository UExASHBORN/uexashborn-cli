import { tokenize } from "./tokenizer";
import { parse } from "./parser";
import { resolveCommand } from "./commandRegistry";
import { emit } from "./eventBus";

export function execute(input, dispatch) {

  const tokens = tokenize(input);
  const parsed = parse(tokens);

  // 🛡️ Guard 1 — no command
  if (!parsed.command) {
    return;
  }

  emit("command:start", { command: parsed.command });

  const result = resolveCommand(parsed);

  // 🛡️ Guard 2 — invalid resolution
  if (!result) {
    emit("command:end", { action: null });
    return;
  }

  dispatch(result);

  emit("command:end", {
    action: result
  });

}