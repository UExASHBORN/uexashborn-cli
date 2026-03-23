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
import { cleanupGame } from "./games/gameRunner";


function render() {

  const toggle = document.getElementById("mode-toggle");

  if (toggle) {
    toggle.textContent = "Switch to GUI";
  }

  if (appState.mode === "CLI") {
    renderCLI(appState);
  } else {
    renderGUI(appState);
  }

}

on("state:changed", (state) => {

  if (state.current !== "GAME_VIEW") {
    cleanupGame();
  }

  render();

  // 🔥 always refocus input after state change
  const input = document.getElementById("cli-input");
  if (input) {
    setTimeout(() => input.focus(), 0);
  }
});


setupCLI((input) => {

  execute(input, dispatch);

});


// const toggle = document.getElementById("mode-toggle");

// if (toggle) {

//   toggle.addEventListener("click", () => {

//     const nextMode =
//       appState.mode === "CLI"
//         ? "GUI"
//         : "CLI";

//     dispatch({
//       type: "SET_MODE",
//       payload: nextMode,
//     });

//   });

// }

const toggle = document.getElementById("mode-toggle");

const { openPopup } = setupGUIPopup();

if (toggle) {

  toggle.addEventListener("click", () => {
    openPopup();
  });

}

function setupGUIPopup() {

  const popup = document.getElementById("gui-popup");
  const closeBtn = document.getElementById("gui-popup-close");

  function openPopup() {
    popup.classList.remove("hidden");
  }

  function closePopup() {
    popup.classList.add("hidden");
  }

  if (closeBtn) {
    closeBtn.addEventListener("click", closePopup);
  }

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closePopup();
    }
  });

  return { openPopup };
}


dispatch({ type: "INIT" });
preloadPoses();

