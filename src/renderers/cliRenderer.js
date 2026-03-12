import { listArticles } from "../core/contentLoader";

const MAX_LINES = 300;

let inputElement;
let outputElement;

const CLI_COMMANDS = [
  "help",
  "clear",
  "root",
  "back",
  "open",
  "play",
  "scan",
  "trace",
  "breach",
  "version",
  "time",
  "status",
  "history",
  "ashborn",
  "exit"
];

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
  
      const value = inputElement.value.trim();
      if (!value) return;
  
      history.push(value);
      historyIndex = history.length;
  
      appendLine(`> ${value}`, "user");
      onInput(value);
  
      inputElement.value = "";
    }

    if (e.key === "Tab") {

      e.preventDefault();
        
      const value = inputElement.value.trim();
        
      if (!value) return;
        
      const matches = CLI_COMMANDS.filter(cmd =>
        cmd.startsWith(value)
      );
    
      if (matches.length === 1) {
        inputElement.value = matches[0] + " ";
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

  appendLine("UExASHBORN CLI", "system");
  appendLine("----------------------------------");
  appendLine("Navigation:", "system");
  appendLine(" help  → show commands");
  appendLine(" root  → return here");
  appendLine(" back  → go back one level");
  appendLine("----------------------------------");

  appendLine("Available sections:");
  appendLine(" - whoami");
  appendLine(" - soc");
  appendLine(" - games");

}

function renderSection(state) {

  appendLine(`Section: ${state.payload}`);
  appendLine("Articles:");

  if (state.payload !== "games") {

    const articles = listArticles(state.payload);

    if (articles.length === 0) {
      appendLine(" (no articles yet)");
    } else {
      articles.forEach((a) => {
        appendLine(` - ${a}`);
      });
    }

    appendLine("Commands:");
    appendLine(" - open <id>");

  } else {

    appendLine("Games:");
    appendLine(" - dino");

    appendLine("Commands:");
    appendLine(" - play <id>");

  }

  appendLine(" - back");

}

function renderArticle(state) {

  const { slug, article } = state.payload || {};

  if (!article) {
    appendLine(`Loading article: ${slug}...`);
    return;
  }

  appendLine("");
  appendLine("----------------------------------");
  appendLine(article.meta?.title || slug);
  appendLine("----------------------------------");
  appendLine("");

  const lines = article.raw.split("\n");

  lines.forEach(line => {

    const cleaned = line.replace(/\s+$/, "");

    if (cleaned === "") {
      appendLine(" ");
    } else {
      appendLine(cleaned);
    }

  });

  appendLine("----------------------------------");
  appendLine("Commands:");
  appendLine(" - back");

}

function renderGame(state) {

  appendLine(`Game: ${state.payload}`);
  appendLine("Commands:");
  appendLine(" - back");

}

const CLI_RENDERERS = {
  INTRO: renderIntro,
  SECTION_VIEW: renderSection,
  ARTICLE_VIEW: renderArticle,
  GAME_VIEW: renderGame
};

export function renderCLI(state) {

  const renderer = CLI_RENDERERS[state.current];

  if (!renderer) return;

  renderer(state);

  requestAnimationFrame(scrollToBottom);

}
const appendLine = (text, type = "system") => {

  const line = document.createElement("div");
  line.textContent = text;

  if (type === "user") {
    line.style.color = "#58a6ff";
  }

  outputElement.appendChild(line);

  if(outputElement.children.length > MAX_LINES){
    outputElement.removeChild(outputElement.firstChild);
  }

};
function scrollToBottom() {
  outputElement.scrollTop = outputElement.scrollHeight;
}
