import matter from "gray-matter";
import { marked } from "marked";

export async function loadMarkdown(path) {
  const res = await fetch(path);
  const raw = await res.text();
  const { data, content } = matter(raw);
  const html = marked(content);

  return {
    meta: data,
    html
  };
}
