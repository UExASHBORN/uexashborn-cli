export function clearScreen() {
  const out = document.getElementById("cli-output");
  if (out) out.innerHTML = "";
}