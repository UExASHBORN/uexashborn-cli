import { tokenize } from "./tokenizer";
import { parse } from "./parser";
import { resolveCommand } from "./commandRegistry";

export function execute(input, dispatch) {
  const tokens = tokenize(input);
  const parsed = parse(tokens);
  const result = resolveCommand(parsed);

  dispatch(result);
}
