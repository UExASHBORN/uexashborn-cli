import { setState } from "./stateMachine";
import { STATES } from "./constants";

export function dispatch(action) {
  switch (action.type) {

    case "INIT":
      setState(STATES.INTRO);
      break;

    case "GO_MAIN":
      setState(STATES.MAIN);
      break;

    case "OPEN_SECTION":
      setState(STATES.SECTION_VIEW, action.payload);
      break;

    case "OPEN_ARTICLE":
      setState(STATES.ARTICLE_VIEW, action.payload);
      break;

    case "OPEN_GAME":
      setState(STATES.GAME_VIEW, action.payload);
      break;

    default:
      console.warn("Unknown action:", action);
  }
}
