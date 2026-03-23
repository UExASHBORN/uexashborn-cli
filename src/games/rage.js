export function startRage(container) {

  let running = true;

  const WIDTH = 30;
  const HEIGHT = 12;

  const player = {
    x: 2,
    y: 8,
    vy: 0,
    grounded: false
  };

  let isDead = false;
  let restartTimer = null;
  let countdown = 5;
  let countdownInterval = null;

  function resetGame() {

    if (isDead) return;
  
    isDead = true;
    countdown = 3;
  
    // start countdown
    countdownInterval = setInterval(() => {
      countdown--;
  
      if (countdown <= 0) {
        clearInterval(countdownInterval);
      }
  
    }, 1000);
  
    // auto restart after 5s
    restartTimer = setTimeout(() => {
      restartGame();
    }, 3000);
  }

  function restartGame() {

    clearTimeout(restartTimer);
    clearInterval(countdownInterval);
  
    player.x = 2;
    player.y = 8;
    player.vy = 0;
    player.grounded = false;
  
    isDead = false;
  }

  const gravity = 0.4;

  const spikes = [
    { x: 10, y: HEIGHT - 2 },
    { x: 15, y: HEIGHT - 2 },
    { x: 20, y: HEIGHT - 2 }
  ];
  
  const keys = {};

  function onKeyDown(e) {

    // 🔥 manual restart
    if (e.key.toLowerCase() === "r" && isDead) {
      restartGame();
      return;
    }
  
    keys[e.key] = true;
  }

  function onKeyUp(e) {
    keys[e.key] = false;
  }

  window.addEventListener("keydown", onKeyDown);
  window.addEventListener("keyup", onKeyUp);

  function update() {

    if (isDead) return;

    // ➡️ LEFT
    if (keys["ArrowLeft"]) {
      if (player.x > 0) {
        player.x -= 0.5;
      }
    }

    // ➡️ RIGHT
    if (keys["ArrowRight"]) {
      if (player.x < WIDTH - 1) {
        player.x += 0.5;
      }
    }

    // jump
    if (keys["ArrowUp"] && player.grounded) {
      player.vy = -2.5;
      player.grounded = false;
    }

    // gravity
    player.vy += gravity;
    player.y += player.vy;

    // ground collision
    if (player.y >= HEIGHT - 2) {
      player.y = HEIGHT - 2;
      player.vy = 0;
      player.grounded = true;
    }

    // ☠️ collision with spikes
    spikes.forEach(spike => {
      if (
        Math.floor(player.x) === spike.x &&
        Math.floor(player.y) === spike.y
      ) {
        resetGame();
      }
    });

  }

  function render() {

      // 💀 death screen
      if (isDead) {
        container.textContent = `
    PLAYER DIED
    
    Press R to restart immediately
    Restarting in ${countdown}...
    `;
        return;
      }

    let grid = "";

    for (let y = 0; y < HEIGHT; y++) {

      for (let x = 0; x < WIDTH; x++) {

        if (Math.floor(player.x) === x && Math.floor(player.y) === y) {
          grid += "P";
        }

        else if (y === HEIGHT - 1) {
          grid += "#";
        }

        else if (
          spikes.some(s => s.x === x && s.y === y)
        ) {
          grid += "^";
        }

        else {
          grid += " ";
        }
      }

      grid += "\n";
    }

    container.textContent = grid;
  }

  function loop() {
    if (!running) return;

    update();
    render();

    requestAnimationFrame(loop);
  }

  loop();

  return function cleanup() {
    running = false;
    window.removeEventListener("keydown", onKeyDown);
    window.removeEventListener("keyup", onKeyUp);
  };
}