// 3D Snake — plays across all 5 walls of the room

const GRID = 20; // cells per row on each wall
const TICK_MS = 150;

// Wall adjacency: when snake exits a wall edge, which wall + entry edge does it go to?
// Format: [wallIndex, rotateDirection] — maps (row,col) to new (row,col) on target wall
const WALLS = ['back', 'left', 'right', 'floor', 'ceiling'];

let gameState = null;

function createGame() {
  // Snake starts on back wall, center
  const snake = [{ wall: 0, r: 10, c: 10 }, { wall: 0, r: 10, c: 9 }, { wall: 0, r: 10, c: 8 }];
  const dir = { dr: 0, dc: 1 }; // moving right
  const apple = spawnApple(snake);
  return { snake, dir, apple, score: 0, alive: true, paused: false };
}

function spawnApple(snake) {
  let a;
  do {
    a = { wall: Math.floor(Math.random() * 5), r: Math.floor(Math.random() * GRID), c: Math.floor(Math.random() * GRID) };
  } while (snake.some(s => s.wall === a.wall && s.r === a.r && s.c === a.c));
  return a;
}

function moveSnake(state) {
  if (!state.alive || state.paused) return;

  const head = state.snake[0];
  let nr = head.r + state.dir.dr;
  let nc = head.c + state.dir.dc;
  let nw = head.wall;

  // Wall wrapping
  if (nc >= GRID) { // exit right
    if (nw === 0) { nw = 2; nc = 0; }       // back → right
    else if (nw === 1) { nw = 0; nc = 0; }   // left → back
    else if (nw === 2) { nc = 0; }            // right wraps
    else { nc = GRID - 1; }                   // floor/ceiling clamp
  } else if (nc < 0) { // exit left
    if (nw === 0) { nw = 1; nc = GRID - 1; } // back → left
    else if (nw === 2) { nw = 0; nc = GRID - 1; } // right → back
    else if (nw === 1) { nc = GRID - 1; }     // left wraps
    else { nc = 0; }
  }
  if (nr >= GRID) { // exit bottom
    if (nw === 0) { nw = 3; nr = 0; }        // back → floor
    else { nr = GRID - 1; }
  } else if (nr < 0) { // exit top
    if (nw === 0) { nw = 4; nr = GRID - 1; } // back → ceiling
    else { nr = 0; }
  }

  const newHead = { wall: nw, r: nr, c: nc };

  // Check self collision
  if (state.snake.some(s => s.wall === newHead.wall && s.r === newHead.r && s.c === newHead.c)) {
    state.alive = false;
    return;
  }

  state.snake.unshift(newHead);

  // Check apple
  if (newHead.wall === state.apple.wall && newHead.r === state.apple.r && newHead.c === state.apple.c) {
    state.score++;
    state.apple = spawnApple(state.snake);
  } else {
    state.snake.pop();
  }
}

export default {
  id: 'snake',
  title: 'Snake',
  icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12h4l2-4 4 8 2-4h4"></path><circle cx="20" cy="12" r="2"></circle></svg>',
  width: 400,
  height: 360,
  wall: 'back',
  showInDock: false,
  openOnStart: false,
  content: () => `
    <div class="snake-game" id="snake-game">
      <div class="snake-info">
        <span class="snake-score" id="snake-score">Score: 0</span>
        <span class="snake-hint">Arrow keys to move · Space to pause</span>
      </div>
      <canvas id="snake-canvas" width="380" height="280"></canvas>
      <div class="snake-status" id="snake-status"></div>
    </div>
  `,
  init: (win) => {
    const canvas = win.element.querySelector('#snake-canvas');
    const scoreEl = win.element.querySelector('#snake-score');
    const statusEl = win.element.querySelector('#snake-status');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const cellW = canvas.width / GRID;
    const cellH = canvas.height / GRID;

    gameState = createGame();
    let intervalId = null;

    const appleImg = new Image();
    appleImg.src = 'public/fresh-apple-icon.webp';

    function draw() {
      ctx.fillStyle = '#0a0020';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Grid lines
      ctx.strokeStyle = 'rgba(80, 60, 180, 0.15)';
      ctx.lineWidth = 0.5;
      for (let i = 0; i <= GRID; i++) {
        ctx.beginPath(); ctx.moveTo(i * cellW, 0); ctx.lineTo(i * cellW, canvas.height); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(0, i * cellH); ctx.lineTo(canvas.width, i * cellH); ctx.stroke();
      }

      // Wall label
      ctx.fillStyle = 'rgba(255,255,255,0.08)';
      ctx.font = '10px monospace';
      ctx.fillText(WALLS[0], 4, 12);

      // Snake (only cells on wall 0 / back wall shown in this simple view)
      // For the window version, show back wall as the main view
      for (const seg of gameState.snake) {
        if (seg.wall !== 0) continue; // only show back wall segments in window
        const x = seg.c * cellW;
        const y = seg.r * cellH;
        ctx.fillStyle = seg === gameState.snake[0] ? 'rgba(100, 200, 150, 0.9)' : 'rgba(100, 200, 150, 0.5)';
        ctx.fillRect(x + 1, y + 1, cellW - 2, cellH - 2);
      }

      // Show off-wall snake count
      const offWall = gameState.snake.filter(s => s.wall !== 0).length;
      if (offWall > 0) {
        ctx.fillStyle = 'rgba(255,255,255,0.2)';
        ctx.font = '10px monospace';
        ctx.fillText(`${offWall} segments on other walls`, 4, canvas.height - 6);
      }

      // Apple
      if (gameState.apple.wall === 0) {
        const ax = gameState.apple.c * cellW;
        const ay = gameState.apple.r * cellH;
        if (appleImg.complete) {
          ctx.drawImage(appleImg, ax + 1, ay + 1, cellW - 2, cellH - 2);
        } else {
          ctx.fillStyle = 'rgba(255, 80, 80, 0.8)';
          ctx.fillRect(ax + 2, ay + 2, cellW - 4, cellH - 4);
        }
      }

      // Game over
      if (!gameState.alive) {
        ctx.fillStyle = 'rgba(0,0,0,0.6)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#fff';
        ctx.font = '20px system-ui';
        ctx.textAlign = 'center';
        ctx.fillText('Game Over', canvas.width / 2, canvas.height / 2 - 10);
        ctx.font = '13px system-ui';
        ctx.fillStyle = 'rgba(255,255,255,0.5)';
        ctx.fillText('Press Enter to restart', canvas.width / 2, canvas.height / 2 + 15);
        ctx.textAlign = 'left';
      }

      scoreEl.textContent = `Score: ${gameState.score}`;
    }

    function tick() {
      moveSnake(gameState);
      draw();
    }

    intervalId = setInterval(tick, TICK_MS);
    draw();

    // Controls
    function onKey(e) {
      if (!gameState) return;
      const { dir } = gameState;

      if (e.key === 'ArrowUp'    && dir.dr !== 1)  { gameState.dir = { dr: -1, dc: 0 }; e.preventDefault(); }
      if (e.key === 'ArrowDown'  && dir.dr !== -1) { gameState.dir = { dr: 1, dc: 0 }; e.preventDefault(); }
      if (e.key === 'ArrowLeft'  && dir.dc !== 1)  { gameState.dir = { dr: 0, dc: -1 }; e.preventDefault(); }
      if (e.key === 'ArrowRight' && dir.dc !== -1) { gameState.dir = { dr: 0, dc: 1 }; e.preventDefault(); }

      if (e.key === ' ') {
        gameState.paused = !gameState.paused;
        statusEl.textContent = gameState.paused ? 'PAUSED' : '';
        e.preventDefault();
      }

      if (e.key === 'Enter' && !gameState.alive) {
        gameState = createGame();
        e.preventDefault();
      }
    }

    document.addEventListener('keydown', onKey);
    win._snakeCleanup = () => {
      clearInterval(intervalId);
      document.removeEventListener('keydown', onKey);
      gameState = null;
    };
  },
  destroy: (win) => {
    if (win._snakeCleanup) win._snakeCleanup();
  },
};
