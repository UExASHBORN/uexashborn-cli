import { setState, appState } from "./stateMachine";
import { STATES } from "./constants";
import { loadArticle } from "./contentLoader";

export function handleGlobalCommand(cmd) {

  switch (cmd) {

    case "help":
      console.log("Showing help...");
      break;

    case "clear":
      console.clear();
      break;
    case "home":
      setState(STATES.INTRO);
      break;
    case "about":
    case "research":
    case "letters":
    case "notes":
    case "games":
      setState(STATES.SECTION_VIEW, cmd);
      break;

    case "exit":
      setState(STATES.INTRO);
      break;

    default:
      console.log("Unhandled global command:", cmd);

  }
}

export function handleContextualCommand(command, args) {

  switch (command) {

    case "back":

      if (appState.current === STATES.SECTION_VIEW) {
        setState(STATES.INTRO);
      }

      else if (appState.current === STATES.ARTICLE_VIEW) {
        setState(STATES.SECTION_VIEW, appState.payload.section);
      }

      else if (appState.current === STATES.GAME_VIEW) {
        setState(STATES.SECTION_VIEW, "games");
      }

      break;

    case "open":

      if (appState.current === STATES.SECTION_VIEW && args.length) {
    
        const section = appState.payload;
        const slug = args[0];
    
        setState(STATES.ARTICLE_VIEW, { section, slug });
    
        loadArticle(section, slug).then((article) => {
    
          if (!article) {
            console.log("Article not found:", slug);
            return;
          }
    
          setState(STATES.ARTICLE_VIEW, {
            section,
            slug,
            article
          });
    
        });
    
      }

    break;

    case "play":

      if (
        appState.current === STATES.SECTION_VIEW &&
        appState.payload === "games" &&
        args.length
      ) {

        setState(STATES.GAME_VIEW, args[0]);

      }

      break;

    case "list":

      console.log("Listing items...");
      break;

    default:

      console.log("Invalid contextual command");

  }
}