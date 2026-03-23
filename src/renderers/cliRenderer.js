import { listArticles } from "../core/contentLoader";
import { CLI_COMMANDS } from "../core/commandRegistry";
import { commandLock } from "../core/commandHandlers";
import { on } from "../core/eventBus";
import { getClosestCommand } from "../utils/cliUtils";
import { SECTIONS } from "../core/constants";
import { GAMES } from "../games/registry";
import { mountGame } from "../games/gameRunner";
import { appState } from "../core/stateMachine";

let lastPromptContext = null;

const MAX_LINES = 300;
// Event Bus Listener (Phase 3)
on("command:start", (data) => {
  console.log("EVENT command:start", data);
});

on("command:end", (data) => {
  console.log("EVENT command:end", data);
});

on("section:enter", (section) => {
  console.log("EVENT section:enter →", section);
});

on("cli:error:unknown", ({ command }) => {

  cliPrint(`Unknown command: ${command}`, "error");

  const suggestion = getClosestCommand(command);

  if (suggestion) {
    cliPrint(`Did you mean: ${suggestion} ?`);
  } else {
    cliPrint("Type 'help' to see available commands.");
  }

});

on("cli:error:args", ({ command }) => {

  cliPrint(`Invalid arguments for command: ${command}`, "error");

});


let inputElement;
let outputElement;

let lastAshbornHover = 0;
const HOVER_COOLDOWN = 8000; // 8 seconds

export function setupCLI(onInput) {
  
  inputElement = document.getElementById("cli-input");

  const fakeCursor = document.getElementById("fake-cursor");
  function updateCursor() {
    if (!fakeCursor) return;
  
    if (inputElement.value.length === 0) {
      fakeCursor.style.display = "inline";
    } else {
      fakeCursor.style.display = "none";
    }
  }
  // initial state
  updateCursor();

  outputElement = document.getElementById("cli-output");

  inputElement.focus();

  const history = [];
  let historyIndex = -1;

  inputElement.addEventListener("keydown", (e) => {

    if(e.ctrlKey && e.key === "l"){
      e.preventDefault();
      outputElement.innerHTML = "";
    }

    // 🔥 prevent game control keys from polluting CLI
    if (appState.current === "GAME_VIEW") {
    
      // block arrow keys completely
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
        e.preventDefault();
        return;
      }
    
      // block 'r' spam when game handles restart
      if (e.key.toLowerCase() === "r") {
        e.preventDefault();
        return;
      }
    }
    
    if (e.key === "Enter") {

      if (commandLock) {
        return;
      }
  
      const value = inputElement.value.trim();
      if (!value) return;
  
      history.push(value);
      historyIndex = history.length;
  
      cliPrint(`>>> ${value}`, "user");
      onInput(value);
  
      inputElement.value = "";
    }

    if (e.key === "Tab") {

      e.preventDefault();

      const value = inputElement.value.trim();
      if (!value) return;

      const parts = value.split(" ");

      // COMMAND AUTOCOMPLETE
      if (parts.length === 1) {
      
        const matches = CLI_COMMANDS.filter(cmd =>
          cmd.startsWith(parts[0])
        );
      
        if (matches.length === 1) {
          inputElement.value = matches[0] + " ";
        }
      
      }
    
      // SECTION AUTOCOMPLETE
      if (parts.length === 2 && parts[0] === "open") {
      
        const matches = SECTIONS.filter(section =>
          section.startsWith(parts[1])
        );
      
        if (matches.length === 1) {
          inputElement.value = `open ${matches[0]}`;
        }
      
      }
    
    }
  
    if (e.key === "ArrowUp") {

      if (appState.current === "GAME_VIEW") return;
  
      if (historyIndex > 0) {
        historyIndex--;
        inputElement.value = history[historyIndex];
      }
  
    }
  
    if (e.key === "ArrowDown") {

      if (appState.current === "GAME_VIEW") return;
  
      if (historyIndex < history.length - 1) {
        historyIndex++;
        inputElement.value = history[historyIndex];
      } else {
        inputElement.value = "";
      }
  
    }
    setTimeout(updateCursor, 0);
    inputElement.addEventListener("input", updateCursor);
  
  });

  document.addEventListener("click", () => {
    inputElement.focus();
  });
}

function renderIntro() {

  cliPrint("UExASHBORN CLI", "system");
  cliPrint("---------------");
  cliPrint("");

  cliPrint("Hey there — welcome to UExASHBORN.");
  cliPrint("");

  cliPrint("If you're new to command line interfaces,");
  cliPrint('type "help" to see available commands.');
  cliPrint("");

  cliPrint("If CLI feels confusing, try the GUI button");
  cliPrint("at the top right.");
  cliPrint("");

  cliPrint("-----------------");
  cliPrint("You can explore sections using:-");
  cliPrint("open <section>  - to explore content");
  cliPrint("play <game>     - to start a game");
  cliPrint("back            - to go one level back");
  cliPrint("root            - to return here");
  cliPrint("");
  cliPrint("");

  cliPrint("AVAILABLE SECTIONS");
  cliPrint("-------------------");

  cliPrint("whoami  → information about the operator");
  cliPrint("soc     → security operations projects and labs");
  cliPrint("games   → terminal experiments and small games");

}

function renderSection(state) {

  const title = state.payload.toUpperCase();
  cliPrint(title);
  cliPrint("-------------");
  cliPrint("");

  if (state.payload === "whoami") {

    cliPrint("It's ADEEL this side.");
    cliPrint("");

    cliPrint("Computer Science student focused on");
    cliPrint("Security Operations and system design.");
    cliPrint("");

    cliPrint("Also a WannaBe Hacker.");
    cliPrint("");

    cliPrint("This terminal is part of my personal project");
    cliPrint("UExASHBORN.");
    cliPrint("");

    cliPrint("-------------");
    cliPrint("");
    cliPrint("Explore my work:-");
  }

  if (state.payload !== "games") {

    const articles = listArticles(state.payload);

    if (articles.length === 0) {
      cliPrint(" (no articles yet)");
    } else {
      articles.forEach((a) => {
        cliPrint(` - ${a}`);
      });
    }
    cliPrint("-------------");
    cliPrint("");

    cliPrint("Commands:");
    cliPrint(" - open <id>");

  } else {

  Object.values(GAMES).forEach(game => {
    cliPrint(` - ${game.name}`);
  });

  cliPrint("-------------");
  cliPrint("");

  cliPrint("Commands:");
  cliPrint(" - play <id>");
}

  cliPrint(" - back");

}

function renderArticle(state) {

  const { slug, article } = state.payload || {};

  if (!article) {
    cliPrint(`Loading article: ${slug}...`);
    return;
  }

  cliPrint("");
  cliPrint("----------------------------------");
  cliPrint(article.meta?.title || slug);
  cliPrint("----------------------------------");

  const lines = article.raw.split("\n");

  lines.forEach(line => {

    const cleaned = line.replace(/\s+$/, "");

    if (cleaned === "") {
      cliPrint(" ");
    } else {
      cliPrint(cleaned);
    }

  });

  cliPrint("----------------------------------");
  cliPrint("Commands:");
  cliPrint(" - back");

}

function renderGame(state) {

  const container = document.getElementById("cli-output");

  if (!container) return;

  container.innerHTML = ""; // clear terminal

  mountGame(state.payload, container);
}

const CLI_RENDERERS = {
  INTRO: renderIntro,
  SECTION_VIEW: renderSection,
  ARTICLE_VIEW: renderArticle,
  GAME_VIEW: renderGame
};

export function renderCLI(state) {

  updatePrompt(state);

  const renderer = CLI_RENDERERS[state.current];

  function updatePrompt(state) {

    const prompt = document.querySelector(".prompt");

    if (!prompt) return;

    let context = "root";

    if (state.current === "SECTION_VIEW") {
      context = state.payload;
    }

    if (state.current === "ARTICLE_VIEW") {
      context = state.payload.section;
    }

    if (state.current === "GAME_VIEW") {
      context = "games";
    }

    if (context === lastPromptContext) return;

    lastPromptContext = context;

    prompt.innerHTML = `
      <span class="prompt-host">ashborn</span>:
      <span class="prompt-context">${context}</span>
      <span class="prompt-symbol">$</span>
      <span class="prompt-arrows"> >>></span>
    `;

  }

  if (!renderer) return;

  renderer(state);

  requestAnimationFrame(scrollToBottom);

}


export function cliPrint(text, type = "system") {

  if (!outputElement) return;

  const line = document.createElement("div");

  if (typeof text === "string") {

  if (text === "") {
    // preserve empty line visually
    line.innerHTML = "&nbsp;";
  } else {
    line.textContent = text;
  }

}

  if (type === "user") {
    line.style.color = "#58a6ff";
  }

  if (type === "error") {
    line.style.color = "#ff6b6b";
  }

  outputElement.appendChild(line);

  if (outputElement.children.length > MAX_LINES) {
    outputElement.removeChild(outputElement.firstChild);
  }

  requestAnimationFrame(scrollToBottom);
}

export function clearScreen() {
  const out = document.getElementById("cli-output");
  if (out) out.innerHTML = "";
}


function scrollToBottom() {

  if (!outputElement) return;

  outputElement.scrollTop = outputElement.scrollHeight;

}