import { STATES } from "./constants";

export const appState = {
  current: STATES.BOOT,
  payload: null
};

export function setState(newState, payload = null) {
  appState.current = newState;
  appState.payload = payload;
}
