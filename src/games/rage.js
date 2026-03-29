function getTitle() {
  return `

██████╗  █████╗  ██████╗ ███████╗     ██████╗  █████╗ ███╗   ███╗███████╗
██╔══██╗██╔══██╗██╔════╝ ██╔════╝    ██╔════╝ ██╔══██╗████╗ ████║██╔════╝
██████╔╝███████║██║  ███╗█████╗      ██║  ███╗███████║██╔████╔██║█████╗  
██╔══██╗██╔══██║██║   ██║██╔══╝      ██║   ██║██╔══██║██║╚██╔╝██║██╔══╝  
██║  ██║██║  ██║╚██████╔╝███████╗    ╚██████╔╝██║  ██║██║ ╚═╝ ██║███████╗
╚═╝  ╚═╝╚═╝  ╚═╝ ╚═════╝ ╚══════╝     ╚═════╝ ╚═╝  ╚═╝╚═╝     ╚═╝╚══════╝
                                                                                                                                                                                                                                                                                                                              
  `;
}

function getInstructions() {
  return `
Controls:
→ ArrowRight : Move Right
← ArrowLeft  : Move Left
↑ ArrowUp    : Jump
R            : Restart

Symbols:
@  = Player
#  = Ground
=  = Platform
^  = Spike
v  = Falling Spike
G  = Goal

Reach G to win. Avoid traps.
`;
}

export function startRage(container) {

    let currentLevel = 1;

    let running = true;
  
    const WIDTH = 60;
    const HEIGHT = 12;

    let platforms = [];

    let fragileTiles = [];
    let delayedSpikes = [];
    let fallingSpikes = [];
    let betrayalSpikes = [];
    let spikes = [];
    let fakeSpikes = [];
    let verticalWalls = [];
    let gaps = [];
    let jumpHeld = false;

    const player = {
      x: 2,
      y: 8,
      vx: 0,
      vy: 0,
      grounded: false
    };

    let coyoteTime = 0;
    let jumpBuffer = 0;
  
    let isDead = false;
    let isWon = false;
    let isFreezing = false;
    let restartTimer = null;
    let countdown = 3;
    let countdownInterval = null;
    let lastFrame = "";
  
    function loadLevel(level) {
    
      // RESET EVERYTHING FIRST
      platforms = [];
      fragileTiles = [];
      delayedSpikes = [];
      fallingSpikes = [];
      gaps = [];
      betrayalSpikes.length = 0;
        
      // DEFAULT PLAYER POSITION
      player.x = 2;
      player.y = 8;
        
      // ----------------------
      // 🟢 LEVEL 1 (CURRENT)level === 1
      // ----------------------
      if (level === 1) {

        gaps = [
          { start: 45, end: 47 }
        ];

        spikes = [
          { x: 18, y: HEIGHT - 2 },
          { x: 19, y: HEIGHT - 2 },
          { x: 20, y: HEIGHT - 2 }
        ];

        fakeSpikes = [
          { x: 10, y: HEIGHT - 2 },
          { x: 11, y: HEIGHT - 2 }
        ];
      
        fragileTiles = [
          { x: 49, y: HEIGHT - 1, active: true, triggered: false },
          { x: 50, y: HEIGHT - 1, active: true, triggered: false },
          { x: 51, y: HEIGHT - 1, active: true, triggered: false },
          { x: 52, y: HEIGHT - 1, active: true, triggered: false },
          { x: 53, y: HEIGHT - 1, active: true, triggered: false }
        ];
      
        delayedSpikes = [
          { x: 35, y: HEIGHT - 2, active: false }
        ];
      
        fallingSpikes = [
          { x: 42, y: 2, vy: 0, active: false }
        ];
      
        betrayalSpikes.push(
          { x: 28, y: HEIGHT - 2, triggered: false }
        );
      }
    
      // ----------------------
      // 🔵 LEVEL 2 (PLATFORMS)
      // ----------------------
      if (level === 2) {

        gaps = [
          { start: 30, end: 33 }
        ];

        // 🟦 PLATFORM PATH (smooth progression)
        platforms = [
          { x: 6,  y: HEIGHT - 4, width: 6 },

          { x: 16, y: HEIGHT - 6, width: 5 },

          // 🔥 MOVING PLATFORM
          {
            x: 26, 
            y: HEIGHT - 5, 
            width: 6,
            moving: true,
            dir: 1,
            minX: 24,
            maxX: 36,
            speed: 0.1,
                    
            // 🔥 attach spike
            hasSpike: true,
            spikeOffset: 2 // position inside platform
          },
        
          { x: 38, y: HEIGHT - 7, width: 5 },
          { x: 50, y: HEIGHT - 5, width: 4 }
        ];
      
        // 🟥 GROUND SPIKES (basic punishment)
        spikes = [
          { x: 12, y: HEIGHT - 2 },
          { x: 13, y: HEIGHT - 2 }
        ];
      
        // 😈 FAKE SPIKES (mind game)
        fakeSpikes = [
          { x: 10, y: HEIGHT - 2 }
        ];
      
        // ⏳ DELAYED TRAP (reaction test)
        delayedSpikes = [
          { x: 22, y: HEIGHT - 2, active: false }
        ];
      
        // ⬇️ FALLING SPIKE (timing pressure)
        fallingSpikes = [
          { x: 34, y: 2, vy: 0, active: false }
        ];
      
        // 🔥 BETRAYAL (final punishment)
        betrayalSpikes.push(
          { x: 54, y: HEIGHT - 2, triggered: false }
        );
      
        fragileTiles = [];
      }

      // ----------------------
      // 🔵 LEVEL 3 (PLATFORMS)
      // ----------------------
      if (level === 3) {

        gaps = [
          { start: 20, end: 23 },
          { start: 42, end: 45 }
        ];

        verticalWalls = [
          {
            x: 40,
            yStart: HEIGHT - 6,
            height: 4,
            moving: true,
            dir: -1,
            minX: 36,
            maxX: 44,
            speed: 0.2
          }
        ];

        // 🟦 PLATFORMS (tight + rage)
        platforms = [

          { x: 6, y: HEIGHT - 4, width: 3 },

          // fake jump → disappears instantly
          { x: 10, y: HEIGHT - 6, width: 2, fragile: true },

          // precision jump
          { x: 14, y: HEIGHT - 8, width: 2 },

          // fast moving platform (rage)
          {
            x: 18,
            y: HEIGHT - 5,
            width: 3,
            moving: true,
            dir: 1,
            minX: 16,
            maxX: 26,
            speed: 0.25
          },
        
          // tiny landing
          { x: 28, y: HEIGHT - 7, width: 2 },
        
          // final jump
          { x: 48, y: HEIGHT - 5, width: 3 }
        ];
      
        // 🟥 GROUND SPIKES (punish hesitation)
        spikes = [
          { x: 10, y: HEIGHT - 2 },
          { x: 11, y: HEIGHT - 2 },
          { x: 30, y: HEIGHT - 2 },
          { x: 31, y: HEIGHT - 2 }
        ];
      
        // 😈 FAKE SPIKE (bait)
        fakeSpikes = [
          { x: 9, y: HEIGHT - 2 }
        ];
      
        // ⏳ DELAYED SPIKE (chain trigger)
        delayedSpikes = [
          { x: 20, y: HEIGHT - 2, active: false },
          { x: 21, y: HEIGHT - 2, active: false }
        ];
      
        // ⬇️ SPIKE RAIN (MULTIPLE)
        fallingSpikes = [
          { x: 26, y: 2, vy: 0, active: false },
          { x: 28, y: 0, vy: 0, active: false },
          { x: 30, y: 3, vy: 0, active: false }
        ];
      
        // 🔥 BETRAYAL END
        betrayalSpikes.push(
          { x: 52, y: HEIGHT - 2, triggered: false }
        );
      
        fragileTiles = [];

        spikes.push(
          { x: 16, y: HEIGHT - 2 },
          { x: 17, y: HEIGHT - 2 }
        );
      }
    }
  
    function resetGame() {

      if (isDead || isFreezing) return;

      // ensure player is visually snapped to ground BEFORE freeze
      player.y = Math.floor(player.y);
      player.vy = 0;
        
      // 🔥 freeze moment (impact feedback)
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
    
      }, 300); // freeze duration
    }
  
    function restartGame() {
  
        clearTimeout(restartTimer);
        clearInterval(countdownInterval);
      
        player.x = 2;
        player.y = 8;
        player.vy = 0;
        player.grounded = false;
      
        isDead = false;
        isWon = false;

        delayedSpikes.forEach(s => {
          s.active = false;
        });

        fallingSpikes.forEach(s => {
          s.y = 2;
          s.vy = 0;
          s.active = false;
        });

        betrayalSpikes.forEach(s => {
          s.triggered = false;
        });

        fragileTiles.forEach(t => {
          t.active = true;
          t.triggered = false;
        });
        loadLevel(currentLevel);
    }

    const goal = { x: 56, y: HEIGHT - 2 };
    
    const keys = {};
  
    function onKeyDown(e) {

      if (e.key === "ArrowUp" || e.key === " ") {
        jumpHeld = true;
      }
  
        // 🔥 manual restart
        if (e.key.toLowerCase() === "r" && (isDead || isWon)) {
          restartGame();
          return;
        }
      
        keys[e.key] = true;
    }
  
    function onKeyUp(e) {

      if (e.key === "ArrowUp" || e.key === " ") {
        jumpHeld = false;
      }
      
      keys[e.key] = false;
    }
  
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
  
    function update() {

      const prevY = player.y;

      // coyote time (after leaving ground)
      if (player.grounded) {
        coyoteTime = 6; // frames
      } else {
        coyoteTime--;
      }

      // jump buffer (before landing)
      if (keys["ArrowUp"] || keys[" "]) {
        jumpBuffer = 6;
      } else {
        jumpBuffer--;
      }

        if (isFreezing) return;
  
        if (isDead) return;

        if (isWon) return;
  
        const accel = player.grounded ? 0.2 : 0.1;
        const maxSpeed = 0.45;

        // LEFT
        if (keys["ArrowLeft"]) {
          player.vx -= accel;
        }

        // RIGHT
        if (keys["ArrowRight"]) {
          player.vx += accel;
        }

        // clamp speed
        if (player.vx > maxSpeed) player.vx = maxSpeed;
        if (player.vx < -maxSpeed) player.vx = -maxSpeed;

        // APPLY MOVEMENT (THIS WAS MISSING)
        player.x += player.vx;

        // clamp after movement
        if (player.x < 0) player.x = 0;
        if (player.x > WIDTH - 1) player.x = WIDTH - 1;

        const friction = player.grounded ? 0.4 : 0.9;
        
        player.vx *= friction;

        if (!keys["ArrowLeft"] && !keys["ArrowRight"]) {
          if (Math.abs(player.vx) < 0.08) player.vx = 0;
        }

        // small threshold stop
        if (Math.abs(player.vx) < 0.05) player.vx = 0;

        // jump
        if (jumpBuffer > 0 && coyoteTime > 0) {
          player.vy = -2.5;
          player.grounded = false;
                
          jumpBuffer = 0;
          coyoteTime = 0;
        }
    
        // gravity
        const gravity = 0.35;
        const fallGravity = 0.6;
        const maxFall = 3;

        // better jump arc
        if (player.vy < 0) {
          // jump cut (short jump if released)
          if (!jumpHeld) {
              player.vy += gravity * 2.5;
            } else {
              player.vy += gravity;
          }
        } else {
          player.vy += fallGravity;
        }

        // limit fall speed
        if (player.vy > maxFall) player.vy = maxFall;

        player.y += player.vy;
    
        // ground collision
        const groundY = HEIGHT - 2;
        const playerX = Math.floor(player.x);

        // fragile tile
        const tileBelow = fragileTiles.find(t => t.x === playerX);
        const isFragileBroken = tileBelow && !tileBelow.active;

        // gap
        const isGap = gaps.some(g =>
          playerX > g.start && playerX < g.end
        );

        // check platforms
        let platformY = null;

        // 🔥 MOVE PLATFORMS
        platforms.forEach(p => {
        
          if (!p.moving) return;
        
          p.x += p.dir * p.speed;
        
          if (p.x <= p.minX || p.x + p.width >= p.maxX) {
            p.dir *= -1; // reverse direction
          }
        
        });

        platforms.forEach(p => {

          const withinX =
            (!p.fragile || p.active !== false) &&
            Math.floor(player.x) >= Math.floor(p.x) &&
            Math.floor(player.x) < Math.floor(p.x) + p.width;
                
          const crossedPlatform =
            prevY <= p.y &&
            player.y >= p.y;
                
          if (withinX && crossedPlatform && player.vy >= 0) {
            platformY = p.y;
          }

          // 🔥 disappearing platform
          if (p.fragile) {
          
            if (
              Math.abs(player.x - p.x) < 1.5 &&
              Math.floor(player.y) === p.y
            ) {
              setTimeout(() => {
                p.active = false;
              }, 50);
            }
          
          }
        
        });

        // 🔥 platform spike collision (SAFE)
        platforms.forEach(p => {
        
          if (!p.hasSpike) return;
        
          const spikeX = Math.floor(p.x) + p.spikeOffset;
          const spikeY = p.y - 1;
        
          if (
            Math.floor(player.x) === spikeX &&
            Math.floor(player.y) === spikeY
          ) {
            resetGame();
          }
        
        });

        // 🔥 move vertical walls
        verticalWalls.forEach(w => {
        
          if (!w.moving) return;
        
          w.x += w.dir * w.speed;
        
          if (w.x <= w.minX || w.x >= w.maxX) {
            w.dir *= -1;
          }
        
        });

        // 🔥 vertical wall collision
        verticalWalls.forEach(w => {
        
          for (let i = 0; i < w.height; i++) {
          
            const wy = w.yStart + i;
          
            if (
              Math.floor(player.x) === Math.floor(w.x) &&
              Math.floor(player.y) === wy
            ) {
              resetGame();
            }
          
          }
        
        });

        let hasGround = !isFragileBroken && !isGap;

        // PRIORITY: platform > ground
        if (platformY !== null) {

          player.y = platformY;
          player.vy = 0;
          player.grounded = true;

          // 🔥 carry player with moving platform
          const currentPlatform = platforms.find(p =>
            player.x >= p.x &&
            player.x <= p.x + p.width &&
            p.y === platformY
          );
        
          if (currentPlatform && currentPlatform.moving) {
            player.x += currentPlatform.dir * currentPlatform.speed * 0.8;
          }
        }
        else if (player.y >= groundY && hasGround) {
          player.y = groundY;
          player.vy = 0;
          player.grounded = true;
        }
        else {
          player.grounded = false;
        }

        // 💀 fall death
        if (player.y > HEIGHT) {
          resetGame();
        }
    
        // normal spikes
        spikes.forEach(spike => {
          if (
            Math.floor(player.x) === spike.x &&
            Math.floor(player.y) === spike.y
          ) {
            resetGame();
          }
        });

        // delayed spikes
        delayedSpikes.forEach(dspike => {
          if (
            dspike.active &&
            Math.floor(player.x) === dspike.x &&
            Math.floor(player.y) === dspike.y
          ) {
            resetGame();
          }
        });
  
        // 🔥 activate delayed spikes
        delayedSpikes.forEach(dspike => {
          if (
            Math.abs(player.x - dspike.x) < 1.5 &&
            !dspike.active
          ) {
            dspike.active = true;
          }
        });

        // 🔥 activate falling spikes
        fallingSpikes.forEach(spike => {
          if (
            Math.abs(player.x - spike.x) < 4 &&
            !spike.active
          ) {
            spike.active = true;
          }
        });

        // falling physics FIRST
        fallingSpikes.forEach(spike => {
          if (spike.active) {
            spike.vy += 0.3;
            spike.y += spike.vy;
          }
        });

        // THEN collision
        fallingSpikes.forEach(spike => {
  if (
    Math.abs(player.x - spike.x) < 0.5 &&
    Math.abs(player.y - spike.y) < 0.7
  ) {
    resetGame();
  }
});

        betrayalSpikes.forEach(spike => {
          if (player.x > spike.x + 0.5) {
            spike.triggered = true;
          }
        });

        betrayalSpikes.forEach(spike => {
          if (
            spike.triggered &&
            Math.floor(player.x) === spike.x &&
            Math.floor(player.y) === spike.y
          ) {
            resetGame();
          }
        });

        fragileTiles.forEach(tile => {

          const nearTile =
            Math.abs(player.x - tile.x) < 1.5 &&
            Math.floor(player.y) === HEIGHT - 2;

          if (tile.active && nearTile) {
          
            if (!tile.triggered) {
              tile.triggered = true;
              tile.active = false;
            }
          
          }
        
        });

        // 🏁 WIN CONDITION (correct placement)
        if (
          Math.floor(player.x) === goal.x &&
          Math.floor(player.y) === goal.y
        ) {
          isWon = true;
        
          setTimeout(() => {
            // advance level
            if (currentLevel === 1) {

              currentLevel = 2;
              restartGame();
              loadLevel(currentLevel);

            } else if (currentLevel === 2) {
            
              currentLevel = 3;
              restartGame();
              loadLevel(currentLevel);
            
            } else {
            
              // 🎯 FINAL LEVEL COMPLETED
              // stop here
            }
          }, 1500);
        }
  
    }
  
    function render() {

        // 🏁 win screen
        if (isWon) {
          const separator = "\n--------------------------------------------------------------------------\n";

          container.textContent =
            getTitle() +
            separator +
            `LEVEL ${currentLevel}\n\n` +
            lastFrame +
            separator +
            `

        LEVEL CLEARED!

        Press R to restart
        Type 'back' to exit
        `;
          return;
        }
  
        // 💀 death screen
        if (isDead) {
          const separator = "\n--------------------------------------------------------------------------\n";


          container.textContent =
            getTitle() +
            separator +
            `LEVEL ${currentLevel}\n\n` +
            lastFrame +
            separator +
            `

        PLAYER DIED

        Press R to restart
        Restarting in ${countdown}...
        `;
          return;
        }
  
      let grid = "";

      for (let y = 0; y < HEIGHT; y++) {
        for (let x = 0; x < WIDTH; x++) {
        
          let char = " ";
        
          // PLAYER (highest priority)
          if (Math.floor(player.x) === x && Math.floor(player.y) === y) {
            char = "@";
          }
        
          // PLATFORM
          else if (
            platforms.some(p =>
              (!p.fragile || p.active !== false) &&
              x >= Math.floor(p.x) &&
              x < Math.floor(p.x) + p.width &&
              y === p.y
            )
          ) {
            char = "=";
          }
        
          // PLATFORM SPIKE
          else if (
            platforms.some(p =>
              p.hasSpike &&
              Math.floor(p.x) + p.spikeOffset === x &&
              p.y - 1 === y
            )
          ) {
            char = "^";
          }
        
          // GROUND
          else if (y === HEIGHT - 1) {
            if (
              gaps.some(g => x > g.start && x < g.end)
            ) {
              char = " ";
            }
            else {
              const fragile = fragileTiles.find(t => t.x === x);
              char = (fragile && !fragile.active) ? " " : "#";
            }
          }
        
          // NORMAL SPIKES
          else if (
            spikes.some(s => s.x === x && s.y === y)
          ) {
            char = "^";
          }
        
          // FAKE SPIKES
          else if (
            fakeSpikes.some(s => s.x === x && s.y === y)
          ) {
            char = "^";
          }
        
          // DELAYED SPIKES
          else if (
            delayedSpikes.some(s => s.x === x && s.y === y)
          ) {
            const ds = delayedSpikes.find(s => s.x === x && s.y === y);
            char = ds.active ? "^" : " ";
          }

          else if (
            verticalWalls.some(w => {
              return Array.from({ length: w.height }).some((_, i) => {
                return (
                  Math.floor(w.x) === x &&
                  (w.yStart + i) === y
                );
              });
            })
          ) {
            char = "|";
          }
        
          // GOAL
          else if (x === goal.x && y === goal.y) {
            char = "G";
          }
        
          // FALLING SPIKE
          else if (
            fallingSpikes.some(s =>
              Math.floor(s.x) === x && Math.floor(s.y) === y
            )
          ) {
            char = "v";
          }
        
          // BETRAYAL SPIKE
          else if (
            betrayalSpikes.some(s => s.x === x && s.y === y)
          ) {
            const b = betrayalSpikes.find(s => s.x === x && s.y === y);
            char = b.triggered ? "^" : " ";
          }
        
          grid += char;
        }
      
        grid += "\n";
      }
  
      lastFrame = grid;
      const separator = "\n--------------------------------------------------------------------------\n";

      container.textContent =
        getTitle() +
        separator +
        `LEVEL ${currentLevel}\n\n` +
        grid +
        separator +
        getInstructions();
    }
  
    function loop() {
      if (!running) return;
  
      update();
      render();
  
      requestAnimationFrame(loop);
    }
    loadLevel(currentLevel);
  
    loop();
  
    return function cleanup() {
      running = false;
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
}