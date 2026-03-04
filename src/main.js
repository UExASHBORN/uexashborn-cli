import './styles/main.css';
import ashbornSVG from "./assets/closeup-rifle-less-px.svg?raw";
const container = document.getElementById("intro-svg");
container.innerHTML = ashbornSVG;
import { appState } from "./core/stateMachine";
import { dispatch } from "./core/dispatch";
import { renderCLI, setupCLI } from "./renderers/cliRenderer";
import { renderGUI } from "./renderers/guiRenderer";

import { execute } from "./core/executor";

function render() {
  const toggle = document.getElementById("mode-toggle");

  if (toggle) {
    toggle.textContent =
      appState.mode === "CLI"
        ? "Switch to GUI"
        : "Switch to CLI";
  }

  if (appState.mode === "CLI") {
    renderCLI(appState);
  } else {
    renderGUI(appState);
  }
}

// Setup CLI input handling ONCE
setupCLI((input) => {
  execute(input, dispatch);
  render();
});

const toggle = document.getElementById("mode-toggle");

if (toggle) {
  toggle.addEventListener("click", () => {
    const nextMode =
      appState.mode === "CLI" ? "GUI" : "CLI";

    dispatch({
      type: "SET_MODE",
      payload: nextMode,
    });

    render();
  });
}

dispatch({ type: "INIT" });
render();
