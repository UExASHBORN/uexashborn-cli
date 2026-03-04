import { STATES } from "./constants";

export const appState = {
  mode: "CLI", // default (temporary)
  current: STATES.INTRO_SEQUENCE,
  payload: null,
};

export function setState(newState, payload = null) {
  appState.current = newState;
  appState.payload = payload;
}
