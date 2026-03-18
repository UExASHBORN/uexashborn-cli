import "./styles/main.css";
import "./core/poseController";
import { preloadPoses } from "./core/poseController";
import { renderIntro } from "./renderers/introRenderer";
import { on } from "./core/eventBus";

const introContainer = document.getElementById("intro-svg");

renderIntro(introContainer);


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

on("state:changed", () => {
  render();
});

setupCLI((input) => {

  execute(input, dispatch);

});


const toggle = document.getElementById("mode-toggle");

if (toggle) {

  toggle.addEventListener("click", () => {

    const nextMode =
      appState.mode === "CLI"
        ? "GUI"
        : "CLI";

    dispatch({
      type: "SET_MODE",
      payload: nextMode,
    });

  });

}


dispatch({ type: "INIT" });
preloadPoses();

