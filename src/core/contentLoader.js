// src/core/contentLoader.js

import { marked } from "marked";

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
  if (!registry[section]) return [];
  return Object.keys(registry[section]);
}

export async function loadArticle(section, slug) {
  if (!registry[section] || !registry[section][slug]) {
    return null;
  }

  const key = `${section}/${slug}`;

  if (cache[key]) {
    return cache[key];
  }

  const raw = await registry[section][slug].loader();

  // ---- Simple frontmatter parser ----
  let meta = {};
  let content = raw;

  if (raw.startsWith("---")) {
    const end = raw.indexOf("---", 3);
    if (end !== -1) {
      const fm = raw.slice(3, end).trim();
      content = raw.slice(end + 3).trim();

      fm.split("\n").forEach((line) => {
        const [k, ...v] = line.split(":");
        meta[k.trim()] = v.join(":").trim();
      });
    }
  }

  const html = marked.parse(content);

  const parsed = { meta, html };

  cache[key] = parsed;

  return parsed;
}
