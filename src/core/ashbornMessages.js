export const ASHBORN_MESSAGES = [
  "curiosity detected",
  "presence acknowledged",
  "input stream observed",
  "watching the terminal?",
  "the system is listening",

  // attitude / personality
  "don't linger",
  "you're still here?",
  "observing... again?",
  "this is getting repetitive",
  "do you need something?",

  // dismissive
  "move along",
  "not now",
  "irrelevant",
  "you are distracting the system",

  // subtle threat vibe
  "tracking cursor movement",
  "pattern recognized",
  "you are being monitored",
  "signal locked",

  // dry humor
  "this amuses me",
  "barely",
  "continue if you must",
  "expected behavior detected"
];

export function getRandomAshbornMessage() {
  const index = Math.floor(Math.random() * ASHBORN_MESSAGES.length);
  return ASHBORN_MESSAGES[index];
}