export function parse(tokens) {

  if (!tokens || !tokens.length) {
    return { command: null, args: [] };
  }

  const command = tokens[0];
  const args = tokens.slice(1);

  return { command, args };
}