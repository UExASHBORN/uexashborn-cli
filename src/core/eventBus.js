const listeners = {};

export function on(event, handler) {

  if (!listeners[event]) {
    listeners[event] = [];
  }

  listeners[event].push(handler);

}

export function emit(event, payload) {

  const handlers = listeners[event];

  if (!handlers) return;

  handlers.forEach(handler => handler(payload));

}