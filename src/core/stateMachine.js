import { STATES } from "./constants";

const VALID_TRANSITIONS = {

  [STATES.INTRO_SEQUENCE]: [STATES.BOOT],

  [STATES.BOOT]: [STATES.INTRO,STATES.SECTION_VIEW],

  [STATES.INTRO]: [STATES.SECTION_VIEW],

  [STATES.MAIN]: [STATES.SECTION_VIEW],

  [STATES.SECTION_VIEW]: [STATES.ARTICLE_VIEW,
    STATES.GAME_VIEW,
    STATES.INTRO],

  [STATES.ARTICLE_VIEW]: [
    STATES.SECTION_VIEW
  ],

  [STATES.GAME_VIEW]: [
    STATES.SECTION_VIEW
  ]

};

export const appState = {
  mode: "CLI", // default (temporary)
  current: STATES.INTRO_SEQUENCE,
  payload: null,
};

export function setState(newState, payload = null) {

  const current = appState.current;

  const allowed = VALID_TRANSITIONS[current] || [];

if (newState === current) {
  appState.payload = payload;
  if (window.__uexashborn_render) {
    window.__uexashborn_render();
  }
  return;
}
if (!allowed.includes(newState)) {

  console.warn(
    `Invalid state transition: ${current} → ${newState}`
  );

  return;
}
  appState.current = newState;
  appState.payload = payload;

  // trigger render automatically
  if (window.__uexashborn_render) {
    window.__uexashborn_render();
  }
  
  import("./eventBus").then(({ emit }) => {
  
    if(newState === "SECTION_VIEW"){
      emit("section:enter", payload);
    }
  
    if(newState === "INTRO"){
      emit("section:enter", "root");
    }
  
  });

}