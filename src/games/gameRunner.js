import { GAMES } from "./registry";

let activeGameCleanup = null;

export async function mountGame(name, container) {

  // cleanup previous game
  if (activeGameCleanup) {
    activeGameCleanup();
    activeGameCleanup = null;
  }

  if (!GAMES[name]) {
    container.textContent = `Game not found: ${name}`;
    return;
  }

  if (name === "rage") {
    const { startRage } = await import("./rage.js");
    activeGameCleanup = startRage(container);
  }
}

export function cleanupGame() {
  if (activeGameCleanup) {
    activeGameCleanup();
    activeGameCleanup = null;
  }
}