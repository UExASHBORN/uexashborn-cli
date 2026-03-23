import { getRandomAshbornMessage } from "../core/ashbornMessages";

const isMobile = () => window.innerWidth < 768;

let lastHover = 0;
const COOLDOWN = 2000;

let activeBubble = null;

export function ashbornSpeakUI(targetEl) {

  if (isMobile()) return; // ❌ disable hover logic entirely

  const now = Date.now();

  if (now - lastHover < COOLDOWN) return;

  lastHover = now;

  const message = getRandomAshbornMessage();

  showBubble(targetEl, message);
}

export function ashbornTapSpeak(targetEl) {

  const message = getRandomAshbornMessage();

  showBubble(targetEl, message);
}

function showBubble(targetEl, text) {

  // remove old
  if (activeBubble) {
    activeBubble.remove();
    activeBubble = null;
  }

  const bubble = document.createElement("div");
  bubble.className = "ashborn-bubble";
  typeText(bubble, text);

  document.body.appendChild(bubble);

  const rect = targetEl.getBoundingClientRect();

  let left = rect.left + rect.width * 0.6;
  let top = rect.top - 20;
  
  // clamp inside viewport
  left = Math.max(10, Math.min(left, window.innerWidth - 150));
  top = Math.max(10, top);
  
  bubble.style.left = left + "px";
  bubble.style.top = top + "px";

  activeBubble = bubble;

  // auto remove
  setTimeout(() => {
    if (bubble === activeBubble) {
      bubble.remove();
      activeBubble = null;
    }
  }, 1800);
}

function typeText(el, text) {
  let i = 0;

  function type() {
    if (i < text.length) {
      el.textContent += text[i];
      i++;
      setTimeout(type, 20); // fast typing
    }
  }

  type();
}