// 3D Snake — takes over the entire room
// The box IS the game arena. Snake moves across all 5 walls.

const GRID = 16;
const TICK_MS = 140;
const WALLS = ['back', 'left', 'right', 'floor', 'ceiling'];

let active = false;
let state = null;
let tickId = null;
let canvases = {};    // wallName → canvas
let wallEls = {};     // wallName → wall element
let overlay = null;   // HUD overlay
let exitCallback = null;

// ── Game state ────────────────────────────────────

function newGame() {
  return {
    snake: [
      { wall: 'back', r: 8, c: 8 },
      { wall: 'back', r: 8, c: 7 },
      { wall: 'back', r: 8, c: 6 },
    ],
    dir: { dr: 0, dc: 1 },
    nextDir: { dr: 0, dc: 1 },
    apple: null,
    score: 0,
    alive: true,
  };
}

function spawnApple(snake) {
  let a;
  do {
    a = { wall: WALLS[Math.floor(Math.random() * 5)], r: Math.floor(Math.random() * GRID), c: Math.floor(Math.random() * GRID) };
  } while (snake.some(s => s.wall === a.wall && s.r === a.r && s.c === a.c));
  return a;
}

// Wall adjacency for snake wrapping
function wrapPosition(wall, r, c) {
  if (c >= GRID) {
    if (wall === 'back')  return { wall: 'right', r, c: 0 };
    if (wall === 'left')  return { wall: 'back',  r, c: 0 };
    if (wall === 'right') return { wall: 'back',  r, c: GRID - 1 }; // wraps back
    return { wall, r, c: GRID - 1 };
  }
  if (c < 0) {
    if (wall === 'back')  return { wall: 'left',  r, c: GRID - 1 };
    if (wall === 'right') return { wall: 'back',  r, c: GRID - 1 };
    if (wall === 'left')  return { wall: 'back',  r, c: 0 };
    return { wall, r, c: 0 };
  }
  if (r >= GRID) {
    if (wall === 'back')  return { wall: 'floor',   r: 0, c };
    return { wall, r: GRID - 1, c };
  }
  if (r < 0) {
    if (wall === 'back')  return { wall: 'ceiling', r: GRID - 1, c };
    return { wall, r: 0, c };
  }
  return { wall, r, c };
}

function tick() {
  if (!state || !state.alive) return;

  state.dir = state.nextDir;
  const head = state.snake[0];
  const raw = { wall: head.wall, r: head.r + state.dir.dr, c: head.c + state.dir.dc };
  const newHead = wrapPosition(raw.wall, raw.r, raw.c);

  // Self collision
  if (state.snake.some(s => s.wall === newHead.wall && s.r === newHead.r && s.c === newHead.c)) {
    state.alive = false;
    render();
    return;
  }

  state.snake.unshift(newHead);

  // Apple
  if (newHead.wall === state.apple.wall && newHead.r === state.apple.r && newHead.c === state.apple.c) {
    state.score++;
    state.apple = spawnApple(state.snake);
  } else {
    state.snake.pop();
  }

  render();
}

// ── Rendering ─────────────────────────────────────

function render() {
  for (const wn of WALLS) {
    const canvas = canvases[wn];
    if (!canvas) continue;
    const ctx = canvas.getContext('2d');
    const w = canvas.width, h = canvas.height;
    const cellW = w / GRID, cellH = h / GRID;

    // Clear
    ctx.clearRect(0, 0, w, h);

    // Grid
    ctx.strokeStyle = 'rgba(100, 80, 200, 0.15)';
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= GRID; i++) {
      ctx.beginPath(); ctx.moveTo(i * cellW, 0); ctx.lineTo(i * cellW, h); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0, i * cellH); ctx.lineTo(w, i * cellH); ctx.stroke();
    }

    // Wall label
    ctx.fillStyle = 'rgba(255,255,255,0.06)';
    ctx.font = `${Math.min(cellW, cellH) * 0.7}px monospace`;
    ctx.textAlign = 'center';
    ctx.fillText(wn, w / 2, h / 2 + cellH * 0.3);
    ctx.textAlign = 'left';

    // Snake segments on this wall
    for (let i = 0; i < state.snake.length; i++) {
      const seg = state.snake[i];
      if (seg.wall !== wn) continue;
      const x = seg.c * cellW, y = seg.r * cellH;
      const isHead = i === 0;
      ctx.fillStyle = isHead ? 'rgba(100, 220, 150, 0.95)' : 'rgba(100, 200, 140, 0.5)';
      ctx.shadowColor = isHead ? 'rgba(100, 220, 150, 0.4)' : 'transparent';
      ctx.shadowBlur = isHead ? 8 : 0;
      ctx.beginPath();
      ctx.roundRect(x + 1, y + 1, cellW - 2, cellH - 2, 3);
      ctx.fill();
      ctx.shadowBlur = 0;
    }

    // Apple on this wall
    if (state.apple && state.apple.wall === wn) {
      const ax = state.apple.c * cellW, ay = state.apple.r * cellH;
      if (appleImg && appleImg.complete) {
        ctx.drawImage(appleImg, ax + 2, ay + 2, cellW - 4, cellH - 4);
      } else {
        ctx.fillStyle = 'rgba(255, 80, 80, 0.85)';
        ctx.beginPath();
        ctx.roundRect(ax + 2, ay + 2, cellW - 4, cellH - 4, 3);
        ctx.fill();
      }
    }

    // Game over on back wall
    if (!state.alive && wn === 'back') {
      ctx.fillStyle = 'rgba(0,0,0,0.5)';
      ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = '#fff';
      ctx.font = '28px system-ui';
      ctx.textAlign = 'center';
      ctx.fillText('Game Over', w / 2, h / 2 - 15);
      ctx.font = '14px system-ui';
      ctx.fillStyle = 'rgba(255,255,255,0.5)';
      ctx.fillText(`Score: ${state.score}`, w / 2, h / 2 + 10);
      ctx.fillText('Enter to restart · Escape to exit', w / 2, h / 2 + 35);
      ctx.textAlign = 'left';
    }
  }

  // Update HUD
  if (overlay) {
    overlay.querySelector('.snake-hud-score').textContent = `Score: ${state.score}`;
  }
}

// ── Apple image ───────────────────────────────────
let appleImg = null;

// ── Public API ────────────────────────────────────

export function startSnake(onExit) {
  if (active) return;
  active = true;
  exitCallback = onExit;

  // Load apple image
  appleImg = new Image();
  appleImg.src = 'public/fresh-apple-icon.webp';

  // Create canvases on each wall
  for (const wn of WALLS) {
    const wall = document.querySelector('.wall-' + wn);
    if (!wall) continue;
    wallEls[wn] = wall;

    const canvas = document.createElement('canvas');
    canvas.className = 'snake-wall-canvas';
    canvas.width = wall.offsetWidth;
    canvas.height = wall.offsetHeight;
    canvas.style.cssText = 'position:absolute; inset:0; width:100%; height:100%; z-index:100;';
    wall.appendChild(canvas);
    canvases[wn] = canvas;
  }

  // HUD overlay
  overlay = document.createElement('div');
  overlay.className = 'snake-hud';
  overlay.innerHTML = `
    <div class="snake-hud-score">Score: 0</div>
    <div class="snake-hud-hint">WASD / Arrows · Escape to exit</div>
  `;
  document.body.appendChild(overlay);

  // Init game
  state = newGame();
  state.apple = spawnApple(state.snake);
  render();
  tickId = setInterval(tick, TICK_MS);

  // Controls
  document.addEventListener('keydown', onKey);
}

function onKey(e) {
  if (!active) return;

  const d = state.nextDir;

  if ((e.key === 'ArrowUp'    || e.key === 'w') && d.dr !== 1)  { state.nextDir = { dr: -1, dc: 0 }; e.preventDefault(); }
  if ((e.key === 'ArrowDown'  || e.key === 's') && d.dr !== -1) { state.nextDir = { dr: 1, dc: 0 }; e.preventDefault(); }
  if ((e.key === 'ArrowLeft'  || e.key === 'a') && d.dc !== 1)  { state.nextDir = { dr: 0, dc: -1 }; e.preventDefault(); }
  if ((e.key === 'ArrowRight' || e.key === 'd') && d.dc !== -1) { state.nextDir = { dr: 0, dc: 1 }; e.preventDefault(); }

  if (e.key === 'Escape') { stopSnake(); e.preventDefault(); }

  if (e.key === 'Enter' && !state.alive) {
    state = newGame();
    state.apple = spawnApple(state.snake);
    render();
    e.preventDefault();
  }
}

export function stopSnake() {
  if (!active) return;
  active = false;

  if (tickId) { clearInterval(tickId); tickId = null; }
  document.removeEventListener('keydown', onKey);

  // Remove canvases
  for (const wn of WALLS) {
    if (canvases[wn]) { canvases[wn].remove(); delete canvases[wn]; }
  }

  // Remove HUD
  if (overlay) { overlay.remove(); overlay = null; }

  state = null;
  if (exitCallback) exitCallback();
}
