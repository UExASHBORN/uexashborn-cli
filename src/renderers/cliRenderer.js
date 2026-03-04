import { listArticles } from "../core/contentLoader";
import { loadArticle } from "../core/contentLoader";

let inputElement;
let outputElement;
let lastState = null;
let lastPayload = null;

export function setupCLI(onInput) {
  inputElement = document.getElementById("cli-input");
  outputElement = document.getElementById("cli-output");

  inputElement.focus();

  inputElement.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      const value = inputElement.value.trim();
      if (!value) return;

      appendLine(`> ${value}`, "user");
      onInput(value);
      inputElement.value = "";
    }
  });

  document.addEventListener("click", () => {
    inputElement.focus();
  });
}

export function renderCLI(state) {
  if (
    state.current === lastState &&
    JSON.stringify(state.payload) === JSON.stringify(lastPayload)
  ) {
    return;
  }

  lastState = state.current;
  lastPayload = state.payload;

  switch (state.current) {

    case "INTRO":
      appendLine("UExASHBORN CLI", "system");
      appendLine("Available sections:", "system");
      appendLine(" - about", "system");
      appendLine(" - research", "system");
      appendLine(" - letters", "system");
      appendLine(" - notes", "system");
      appendLine(" - games", "system");
      break;

    case "SECTION_VIEW":
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
      break;

    case "ARTICLE_VIEW": {
      const { section, slug } = state.payload;

      appendLine(`Loading article: ${slug}...`);

      loadArticle(section, slug).then((article) => {
        if (!article) {
          appendLine("Article not found.");
          return;
        }

        appendLine("----------------------------------");
        appendLine(article.meta.title || slug);
        appendLine("----------------------------------");

        const temp = document.createElement("div");
        temp.innerHTML = article.html;

        temp.querySelectorAll("*").forEach((el) => {
          appendLine(el.textContent);
        });

        appendLine("----------------------------------");
        appendLine("Commands:");
        appendLine(" - back");

        scrollToBottom();
      });

      break;
    }

    case "GAME_VIEW":
      appendLine(`Game: ${state.payload}`, "system");
      appendLine("Commands:", "system");
      appendLine(" - back", "system");
      break;
  }

  scrollToBottom();
}

function appendLine(text, type = "system") {
  const line = document.createElement("div");
  line.textContent = text;

  if (type === "user") {
    line.style.color = "#58a6ff";
  }

  outputElement.appendChild(line);
}

function scrollToBottom() {
  outputElement.scrollTop = outputElement.scrollHeight;
}
