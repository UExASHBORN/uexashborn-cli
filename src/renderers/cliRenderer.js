import { listArticles } from "../core/contentLoader";
import { CLI_COMMANDS } from "../core/commandRegistry";
import { commandLock } from "../core/commandHandlers";
import { on } from "../core/eventBus";
import { getClosestCommand } from "../utils/cliUtils";
import { SECTIONS } from "../core/constants";

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
on("cli:log", ({ time, command, args }) => {

  const full = [command, ...args].join(" ");

  cliPrint(`[${time}] command received: ${full}`);

});

on("cli:error:args", ({ command }) => {

  cliPrint(`Invalid arguments for command: ${command}`, "error");

});


let inputElement;
let outputElement;

export function setupCLI(onInput) {
  
  inputElement = document.getElementById("cli-input");
  outputElement = document.getElementById("cli-output");

  inputElement.focus();

  const history = [];
  let historyIndex = -1;

  inputElement.addEventListener("keydown", (e) => {

    if(e.ctrlKey && e.key === "l"){
      e.preventDefault();
      outputElement.innerHTML = "";
    }

    if (e.key === "Enter") {

      if (commandLock) {
        return;
      }
  
      const value = inputElement.value.trim();
      if (!value) return;
  
      history.push(value);
      historyIndex = history.length;
  
      cliPrint(`> ${value}`, "user");
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
  
      if (historyIndex > 0) {
        historyIndex--;
        inputElement.value = history[historyIndex];
      }
  
    }
  
    if (e.key === "ArrowDown") {
  
      if (historyIndex < history.length - 1) {
        historyIndex++;
        inputElement.value = history[historyIndex];
      } else {
        inputElement.value = "";
      }
  
    }
  
  });

  document.addEventListener("click", () => {
    inputElement.focus();
  });
}

function renderIntro() {

  cliPrint("UExASHBORN CLI", "system");
  cliPrint("----------------------------------");
  cliPrint("Navigation:", "system");
  cliPrint(" help  → show commands");
  cliPrint(" root  → return here");
  cliPrint(" back  → go back one level");
  cliPrint("----------------------------------");

  cliPrint("Available sections:");

  SECTIONS.forEach(section => {
    cliPrint(` - ${section}`);
  });

}

function renderSection(state) {

  const title = state.payload.toUpperCase();
  cliPrint(title);
  cliPrint("-------------");
  cliPrint("");

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

    cliPrint(" - dino");
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
  cliPrint("");

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

  cliPrint(`Game: ${state.payload}`);
  cliPrint("Commands:");
  cliPrint(" - back");

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

    prompt.textContent = `ashborn:${context}$ >>>`;

  }

  if (!renderer) return;

  renderer(state);

  requestAnimationFrame(scrollToBottom);

}


export function cliPrint(text, type = "system") {

  if (!outputElement) return;

  const line = document.createElement("div");

  if (typeof text === "string") {
    line.textContent = text;
  } else {
    line.appendChild(text);
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