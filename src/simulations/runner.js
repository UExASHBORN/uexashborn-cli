import { cliPrint } from "../renderers/cliRenderer";

export async function runSimulation(lines, speed = 20, delay = 400) {

  for (const line of lines) {

    await typeLine(line, speed);

    await wait(delay);

  }

}

function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function typeLine(text, speed) {

  const container = document.createElement("div");

  cliPrint(container);

  for (let i = 0; i < text.length; i++) {

    container.textContent += text[i];

    await wait(speed);

  }

}