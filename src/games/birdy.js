function getTitle() {
  return `
██████╗ ██╗██████╗ ██████╗ ██╗   ██╗     ██████╗  █████╗ ███╗   ███╗███████╗
██╔══██╗██║██╔══██╗██╔══██╗╚██╗ ██╔╝    ██╔════╝ ██╔══██╗████╗ ████║██╔════╝
██████╔╝██║██████╔╝██║  ██║ ╚████╔╝     ██║  ███╗███████║██╔████╔██║█████╗  
██╔══██╗██║██╔══██╗██║  ██║  ╚██╔╝      ██║   ██║██╔══██║██║╚██╔╝██║██╔══╝  
██████╔╝██║██║  ██║██████╔╝   ██║       ╚██████╔╝██║  ██║██║ ╚═╝ ██║███████╗
╚═════╝ ╚═╝╚═╝  ╚═╝╚═════╝    ╚═╝        ╚═════╝ ╚═╝  ╚═╝╚═╝     ╚═╝╚══════╝
                                                                            
`;
}

export function startBirdy(container) {

  let running = true;

  const WIDTH = 60;
  const HEIGHT = 12;

  const player = {
    x: 10,
    y: Math.floor(HEIGHT / 2),
  };

  let obstacles = [];
  let frame = 0;
  let speed = 0.2;
  let score = 0;
  let speedBoostTimer = 0;
  let milestoneText = "";
  let milestoneTimer = 0;
  let highScore = 0;
  let countdown = 3;
  let countdownInterval = null;
  let lastFrame = "";
  let finalScore = 0;
  let finalHighScore = 0;

  const keys = {};

  function onKeyDown(e) {
    keys[e.key] = true;
  
    if (e.key.toLowerCase() === "r" && isDead) {
      restartGame();
    }
  }

  function onKeyUp(e) {
    keys[e.key] = false;
  }

  window.addEventListener("keydown", onKeyDown);
  window.addEventListener("keyup", onKeyUp);

  let lastSpawnX = 0;

    function spawnByPhase() {

      // 🟢 0–500 → single blocks
      if (score < 500) {
        spawnBlock();
        return;
      }

      // 🟡 500–1000 → 2–3 blocks
      if (score < 1000) {
        let count;

        // 🎯 after 2000 → controlled targeted traps
        if (score >= 2000) {
          count = Math.random() < 0.7 ? 1 : 2; // 70% → 1, 30% → 2
        }
        else {
          count = 1 + Math.floor(Math.random() * 3);
        }

        for (let i = 0; i < count; i++) {
          spawnBlock();
        }
        return;
      }

      // 🔵 1000–2000 → pipe + optional block
      if (score < 2000) {
        spawnPipe();

        if (Math.random() < 0.25){
          spawnBlock();
        }

        return;
      }

      // 🔴 2000+ → ONE pipe + optional block
      spawnPipe();

      if (Math.random() < 0.25) {
        spawnBlock();
      }
    }

    function countBlocksAtColumn(x) {
      return obstacles.filter(o =>
        o.type === "block" && Math.floor(o.x) === x
      ).length;
    }

    function hasPipeAtColumn(x) {
      return obstacles.some(o =>
        o.type === "pipe" && Math.floor(o.x) === x
      );
    }
  
    function spawnBlock() {
  
      let baseY;

      // 🎯 targeted traps after 2000
      if (score >= 2000 && Math.random() < 0.25) {
        baseY = Math.floor(player.y) + (Math.random() < 0.5 ? -1 : 1);
      }
      else if (Math.random() < 0.6) {
        baseY = Math.floor(player.y) + (Math.random() < 0.5 ? -1 : 1);
      }
      else {
        baseY = Math.floor(Math.random() * HEIGHT);
      }

      const count = 1 + Math.floor(Math.random() * 3); // 1–3 blocks

      let placed = 0;
    
      for (let i = 0; i < count; i++) {
        
        const y = baseY + i;
        
        if (y < 0 || y >= HEIGHT) continue;
        if (placed >= 3) break;
        
        let columnX = WIDTH - 1;

        // after 2000 → allow coexistence but shift column
        if (hasPipeAtColumn(columnX)) {
        
          if (score < 2000) return;
        
          // shift block left of pipe
          columnX = WIDTH - (3 + Math.floor(Math.random() * 5));
        }

        if (countBlocksAtColumn(columnX) >= 3) break;

        obstacles.push({
          x: columnX,
          y,
          type: "block"
        });

        placed++;
      }
    }

  function spawnPipe() {

    const gapSize = 5 + Math.floor(Math.random() * 2); // 5–6
  
    const margin = 1;

    const gapStart = Math.max(
      margin,
      Math.min(
        HEIGHT - gapSize - margin,
        Math.floor(Math.random() * (HEIGHT - gapSize))
      )
    );
  
    obstacles.push({
      x: WIDTH - 1,
      gapStart,
      gapEnd: gapStart + gapSize - 1,
      type: "pipe"
    });
  }
  
  let isDead = false;
  let isFreezing = false;
  let restartTimer = null;

  function triggerDeath() {

    highScore = Math.max(highScore, score);
    finalScore = score;
    finalHighScore = highScore;
  
    if (isDead || isFreezing) return;
  
    isFreezing = true;
  
    setTimeout(() => {
      isFreezing = false;
  
      isDead = true;
      countdown = 3;
  
      countdownInterval = setInterval(() => {
        countdown--;
  
        if (countdown <= 0) {
          clearInterval(countdownInterval);
        }
  
      }, 1000);
  
      restartTimer = setTimeout(() => {
        restartGame();
      }, 3000);
  
    }, 150);
  }

  function restartGame() {

    clearInterval(countdownInterval);

    clearTimeout(restartTimer);
  
    player.y = HEIGHT / 2;
  
    obstacles = [];
    frame = 0;
    speed = 0.2;
    score = 0;
  
    isDead = false;
  }

  function update() {

    // 🎉 milestones
    if (score === 1000 || score === 2000 || score === 3000 || score === 4000) {
      milestoneText = `>>> ${score} <<<`;
      milestoneTimer = 60;
    }

    if (milestoneTimer > 0) {
      milestoneTimer--;
    }

    if (isDead || isFreezing) return;

    frame++;

    // 🎮 smooth input handling
    if (keys["ArrowUp"]) {
      player.y -= 0.4;
    }

    if (keys["ArrowDown"]) {
      player.y += 0.4;
    }

    // discourage staying in same position too long
    if (frame % 180 === 0) {
      if (Math.random() < 0.5 && score < 1000) {
        spawnBlock();
      }
    }

    // bounds
    // clamp
    if (player.y < 0) player.y = 0;

    // bottom = death zone (not clamp)
    const FLOOR = HEIGHT - 1;
    if (player.y > FLOOR) player.y = FLOOR;

    // spawn obstacle

    lastSpawnX++;

    let baseDistance = 60;

    if (score < 500) {
      baseDistance = 60;
    }
    else if (score < 1000) {
      baseDistance = 50;
    }
    else if (score < 2000) {
      baseDistance = 35;
    }
    else {
      baseDistance = 25;
    }

    // add randomness
    const spawnDistance = baseDistance + Math.floor(Math.random() * 10) - 5;
    
    // spawn trigger
    if (lastSpawnX >= spawnDistance) {
      spawnByPhase();
      lastSpawnX = 0;
    }

    // move obstacles
    obstacles.forEach(o => {
      o.x -= speed;
    });

    // remove off-screen
    obstacles = obstacles.filter(o => o.x > -1);

    // collision
    for (let o of obstacles) {

      if (Math.floor(o.x) !== player.x) continue;

      const py = Math.floor(player.y);

      if (o.type === "block") {
        if (o.y === py) triggerDeath();
      }

      if (o.type === "pipe") {
        if (py < o.gapStart || py > o.gapEnd) {
          triggerDeath();
        }
      }
    }

    // 🎯 near miss bonus feel
    for (let o of obstacles) {

      if (Math.floor(o.x) === player.x + 1 && o.type === "pipe") {

        const py = Math.floor(player.y);

        if (py === o.gapStart || py === o.gapEnd) {
          score += 2; // tiny reward
        }
      }
    }

    // difficulty scaling
    let baseSpeed = 0.2 + Math.min(0.4, score / 3000);
    
    // 🚀 speed burst after 3000
    if (score > 3000 && Math.random() < 0.01 && speedBoostTimer === 0) {
      speedBoostTimer = 60; // ~1 sec
    }
    
    if (speedBoostTimer > 0) {
      baseSpeed += 0.3;
      speedBoostTimer--;
    }
    
    speed = baseSpeed;

    score++;
  }

  function render() {

    const separator = "\n-----------------------------------------------------------------------------\n";

    if (isDead) {

        const scoreText = `SCORE: ${finalScore}`;
        const highText = `HIGH: ${finalHighScore}`;

        container.textContent =
          getTitle() +
          separator +
          `${scoreText.padEnd(30, " ")}${highText}\n` +
          `\n\n` +
          lastFrame +
          separator +
          `\nGAME OVER\n\n` +
          `Restarting in ${countdown}...\n` +
          `Press R to restart\n`;

      return;
    }

    let grid = "";

    for (let y = 0; y < HEIGHT; y++) {
      for (let x = 0; x < WIDTH; x++) {

        let char = " ";

        // 💥 death flash

        if (x === player.x && y === Math.floor(player.y)) {
          const playerFrames = [">", "»", "›"];
          char = playerFrames[Math.floor(frame / 10) % playerFrames.length];
        }

        else {

          let isBlock = false;
          let isPipe = false;

          for (let o of obstacles) {
        
            if (Math.floor(o.x) !== x) continue;
        
            if (o.type === "block" && o.y === y) {
              isBlock = true;
              break;
            }
        
            if (o.type === "pipe") {
              if (y < o.gapStart || y > o.gapEnd) {
                isPipe = true;
              }
            }
          }
      
          if (isBlock) char = "#";
          else if (isPipe) char = "|";
        }

        grid += char;
      }
      grid += "\n";
    }
    lastFrame = grid;

    const scoreText = `SCORE: ${score}${speedBoostTimer > 0 ? " ⚡" : ""}`;
    const highText = `HIGH: ${highScore}`;

    container.textContent =
      getTitle() +
      `\n-----------------------------------------------------------------------------\n` +
      `${scoreText.padEnd(30, " ")}${highText}\n` +
      (milestoneTimer > 0 ? milestoneText : " ") + "\n\n" +
      grid +
      `\n-----------------------------------------------------------------------------\n` +
      `\nControls: ↑ ↓\n` +
      `\nLegend:\n` +
      `>  = Player\n` +
      `#  = Random obstacle\n` +
      `|  = Pipe (avoid walls, pass gap)\n` +
      `\nSurvive as long as possible. Difficulty increases over time.\n`;
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