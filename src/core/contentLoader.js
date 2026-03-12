// src/core/contentLoader.js

import { marked } from "marked";
import { setState, appState } from "./stateMachine";
import { STATES } from "./constants";

/*
  Vite dynamic import:
  - eager: false → lazy loading
  - returns function to import module
*/
const modules = import.meta.glob("/src/content/**/*.md", {
  as: "raw",
});

const registry = {};
const cache = {};

const ALLOWED_SECTIONS = ["soc","games","whoami"];

/*
  Build registry structure:

  registry = {
    about: {
      mission: { path, loader }
    }
  }
*/

function buildRegistry() {
  for (const path in modules) {
    const parts = path.split("/content/")[1].split("/");
    const section = parts[0];
    const file = parts[1].replace(".md", "");

    if (!registry[section]) {
      registry[section] = {};
    }

    registry[section][file] = {
      path,
      loader: modules[path],
    };
  }
}

buildRegistry();

/* ---------------------------- */
/* --------- API -------------- */
/* ---------------------------- */

export function listSections() {
  return Object.keys(registry);
}

export function listArticles(section) {
  if (!ALLOWED_SECTIONS.includes(section)) return [];
  if (!registry[section]) return [];
  return Object.keys(registry[section]);
}

export async function loadArticle(section, slug) {

  if (!registry[section] || !registry[section][slug]) {
    console.warn("Article not found:", section, slug);
    return;
  }

  const { loader } = registry[section][slug];

  const raw = await loader();

  const match = raw.match(/---([\s\S]*?)---([\s\S]*)/);

  let meta = {};
  let body = raw;

  if (match) {
    const metaRaw = match[1];
    body = match[2];

    metaRaw.split("\n").forEach(line => {
      const [key, value] = line.split(":");
      if (key && value) {
        meta[key.trim()] = value.trim();
      }
    });
  }

  const html = marked(body);

  const article = {
    meta,
    html,
    raw: body
  };

  setState(STATES.ARTICLE_VIEW, {
    section,
    slug,
    article
  });

}