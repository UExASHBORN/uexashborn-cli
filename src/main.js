import './styles/main.css';

import { appState } from "./core/stateMachine";
import { dispatch } from "./core/dispatch";
import { renderCLI } from "./renderers/cliRenderer";
import { renderGUI } from "./renderers/guiRenderer";

function render() {
  renderCLI(appState);
  renderGUI(appState);
}

dispatch({ type: "INIT" });
render();
