// 3D Snake — takes over the entire room
// Dark backdrop covers all walls, clean grid, snake with head/eyes

const GRID = 16;
const TICK_MS = 130;
const WALLS = ['back', 'left', 'right', 'floor', 'ceiling'];

let active = false;
let state = null;
let tickId = null;
let canvases = {};
let backdrops = {};
let overlay = null;
let exitCallback = null;
let appleImg = null;

// ── Game state ────────────────────────────────────

function newGame() {
  const s = {
    snake: [
      { wall: 'back', r: 8, c: 8 },
      { wall: 'back', r: 8, c: 7 },
      { wall: 'back', r: 8, c: 6 },
      { wall: 'back', r: 8, c: 5 },
    ],
    dir: { dr: 0, dc: 1 },
    inputQueue: [],
    apple: null,
    score: 0,
    alive: true,
  };
  s.apple = spawnApple(s.snake, true);
  return s;
}

function spawnApple(snake, preferBack = false) {
  let a;
  do {
    const w = preferBack ? 'back' : WALLS[Math.floor(Math.random() * 5)];
    a = { wall: w, r: Math.floor(Math.random() * GRID), c: Math.floor(Math.random() * GRID) };
  } while (snake.some(s => s.wall === a.wall && s.r === a.r && s.c === a.c));
  return a;
}

// Returns { wall, r, c, newDir } — newDir is set only when direction must rotate
function wrapPosition(wall, r, c, dir) {
  const N = GRID, L = N - 1;

  // ── Right edge (c >= N) ──
  if (c >= N) {
    // Same-orientation transitions (no direction change needed)
    if (wall === 'back')    return { wall: 'right',   r,     c: 0 };
    if (wall === 'left')    return { wall: 'back',    r,     c: 0 };
    if (wall === 'right')   return { wall: 'left',    r,     c: 0 };
    // 90° transitions — r position maps to entry position along shared edge
    if (wall === 'floor')   return { wall: 'right',   r: L,  c: L - r,  newDir: { dr: -1, dc: 0 } };
    if (wall === 'ceiling') return { wall: 'right',   r: 0,  c: r,      newDir: { dr: 1, dc: 0 } };
  }
  // ── Left edge (c < 0) ──
  if (c < 0) {
    if (wall === 'back')    return { wall: 'left',    r,     c: L };
    if (wall === 'right')   return { wall: 'back',    r,     c: L };
    if (wall === 'left')    return { wall: 'right',   r,     c: L };
    if (wall === 'floor')   return { wall: 'left',    r: L,  c: r,      newDir: { dr: -1, dc: 0 } };
    if (wall === 'ceiling') return { wall: 'left',    r: 0,  c: L - r,  newDir: { dr: 1, dc: 0 } };
  }
  // ── Bottom edge (r >= N) ──
  if (r >= N) {
    if (wall === 'back')    return { wall: 'floor',   r: 0,  c };
    if (wall === 'floor')   return { wall: 'ceiling', r: 0,  c };
    if (wall === 'ceiling') return { wall: 'back',    r: 0,  c };
    // 90° transitions — c position maps to entry position along the shared edge
    if (wall === 'left')    return { wall: 'floor',   r: c,      c: 0,  newDir: { dr: 0, dc: 1 } };
    if (wall === 'right')   return { wall: 'floor',   r: L - c,  c: L,  newDir: { dr: 0, dc: -1 } };
  }
  // ── Top edge (r < 0) ──
  if (r < 0) {
    if (wall === 'back')    return { wall: 'ceiling', r: L,  c };
    if (wall === 'ceiling') return { wall: 'floor',   r: L,  c };
    if (wall === 'floor')   return { wall: 'back',    r: L,  c };
    // 90° transitions
    if (wall === 'left')    return { wall: 'ceiling', r: L - c,  c: 0,  newDir: { dr: 0, dc: 1 } };
    if (wall === 'right')   return { wall: 'ceiling', r: c,      c: L,  newDir: { dr: 0, dc: -1 } };
  }
  return { wall, r, c };
}

function tick() {
  if (!state || !state.alive) return;
  // Consume one input from the queue per tick
  if (state.inputQueue.length > 0) {
    state.dir = state.inputQueue.shift();
  }
  const head = state.snake[0];
  const result = wrapPosition(head.wall, head.r + state.dir.dr, head.c + state.dir.dc, state.dir);
  const newHead = { wall: result.wall, r: result.r, c: result.c };
  // Apply direction rotation from 90° wall transitions
  if (result.newDir) state.dir = result.newDir;

  if (state.snake.some(s => s.wall === newHead.wall && s.r === newHead.r && s.c === newHead.c)) {
    state.alive = false;
    render();
    return;
  }

  state.snake.unshift(newHead);
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
    const cw = w / GRID, ch = h / GRID;

    // Dark background
    ctx.fillStyle = '#06001a';
    ctx.fillRect(0, 0, w, h);

    // Grid — visible lines with subtle glow at intersections
    ctx.strokeStyle = 'rgba(100, 80, 220, 0.25)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= GRID; i++) {
      ctx.beginPath(); ctx.moveTo(i * cw, 0); ctx.lineTo(i * cw, h); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0, i * ch); ctx.lineTo(w, i * ch); ctx.stroke();
    }
    // Dot at each intersection
    ctx.fillStyle = 'rgba(120, 100, 240, 0.2)';
    for (let r = 0; r <= GRID; r++) {
      for (let c = 0; c <= GRID; c++) {
        ctx.beginPath();
        ctx.arc(c * cw, r * ch, 1.5, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    // Border around the wall
    ctx.strokeStyle = 'rgba(120, 100, 240, 0.35)';
    ctx.lineWidth = 2;
    ctx.strokeRect(1, 1, w - 2, h - 2);

    // Snake body — connected segments with gradient
    const segs = state.snake.filter(s => s.wall === wn);
    for (let i = segs.length - 1; i >= 0; i--) {
      const seg = segs[i];
      const idx = state.snake.indexOf(seg);
      const x = seg.c * cw, y = seg.r * ch;
      const t = idx / Math.max(1, state.snake.length - 1); // 0 = head, 1 = tail

      if (idx === 0) {
        // HEAD — rounded with eyes
        const pad = 1;
        ctx.fillStyle = 'rgba(80, 220, 140, 0.95)';
        ctx.shadowColor = 'rgba(80, 220, 140, 0.5)';
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.roundRect(x + pad, y + pad, cw - pad * 2, ch - pad * 2, cw * 0.3);
        ctx.fill();
        ctx.shadowBlur = 0;

        // Eyes — based on direction
        const eyeR = cw * 0.12;
        const ex1 = x + cw * 0.32, ex2 = x + cw * 0.68;
        const ey1 = y + ch * 0.32, ey2 = y + ch * 0.68;
        let lx, ly, rx, ry;
        if (state.dir.dc === 1)       { lx = ex2; ly = ey1; rx = ex2; ry = ey2; } // right
        else if (state.dir.dc === -1) { lx = ex1; ly = ey1; rx = ex1; ry = ey2; } // left
        else if (state.dir.dr === -1) { lx = ex1; ly = ey1; rx = ex2; ry = ey1; } // up
        else                          { lx = ex1; ly = ey2; rx = ex2; ry = ey2; } // down

        ctx.fillStyle = '#fff';
        ctx.beginPath(); ctx.arc(lx, ly, eyeR, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(rx, ry, eyeR, 0, Math.PI * 2); ctx.fill();
        // Pupils
        ctx.fillStyle = '#111';
        ctx.beginPath(); ctx.arc(lx, ly, eyeR * 0.5, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(rx, ry, eyeR * 0.5, 0, Math.PI * 2); ctx.fill();
      } else {
        // BODY — fade from green to darker toward tail
        const g = Math.round(180 - t * 80);
        const a = 0.85 - t * 0.35;
        ctx.fillStyle = `rgba(70, ${g}, 120, ${a})`;
        const pad = 2;
        ctx.beginPath();
        ctx.roundRect(x + pad, y + pad, cw - pad * 2, ch - pad * 2, 3);
        ctx.fill();
      }
    }

    // Apple
    if (state.apple && state.apple.wall === wn) {
      const ax = state.apple.c * cw, ay = state.apple.r * ch;
      if (appleImg && appleImg.complete) {
        ctx.drawImage(appleImg, ax + 2, ay + 2, cw - 4, ch - 4);
      } else {
        ctx.fillStyle = 'rgba(255, 60, 60, 0.95)';
        ctx.shadowColor = 'rgba(255, 60, 60, 0.5)';
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(ax + cw / 2, ay + ch / 2, cw * 0.35, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    }

  }

  // Game over — floating HTML overlay in center of viewport
  if (!state.alive && !document.querySelector('.snake-gameover')) {
    const go = document.createElement('div');
    go.className = 'snake-gameover';
    go.innerHTML = `
      <div style="font-size:36px; font-weight:800; color:rgba(255,80,80,0.9);">Game Over</div>
      <div style="font-size:20px; color:rgba(100,220,150,0.9); margin:8px 0;">Score: ${state.score}</div>
      <div style="font-size:13px; color:rgba(255,255,255,0.4);">Enter to restart · Escape to exit</div>
    `;
    document.body.appendChild(go);
  }

  if (overlay) {
    overlay.querySelector('.snake-hud-score').textContent = `Score: ${state.score}`;
  }
}

// ── Public API ────────────────────────────────────

export function startSnake(onExit) {
  if (active) return;
  active = true;
  exitCallback = onExit;

  appleImg = new Image();
  appleImg.src = 'public/fresh-apple-icon.webp';

  // Create dark backdrop + canvas on each wall
  for (const wn of WALLS) {
    const wall = document.querySelector('.wall-' + wn);
    if (!wall) continue;

    // Opaque backdrop covers all existing content
    const backdrop = document.createElement('div');
    backdrop.className = 'snake-backdrop';
    backdrop.style.cssText = 'position:absolute; inset:0; background:#06001a; z-index:99;';
    wall.appendChild(backdrop);
    backdrops[wn] = backdrop;

    // Game canvas on top
    const canvas = document.createElement('canvas');
    canvas.className = 'snake-wall-canvas';
    canvas.width = wall.offsetWidth;
    canvas.height = wall.offsetHeight;
    canvas.style.cssText = 'position:absolute; inset:0; width:100%; height:100%; z-index:100;';
    wall.appendChild(canvas);
    canvases[wn] = canvas;
  }

  // HUD
  overlay = document.createElement('div');
  overlay.className = 'snake-hud';
  overlay.innerHTML = `
    <div class="snake-hud-score">Score: 0</div>
    <div class="snake-hud-hint">WASD / Arrows to move · Escape to exit</div>
  `;
  document.body.appendChild(overlay);

  state = newGame();
  render();
  tickId = setInterval(tick, TICK_MS);
  document.addEventListener('keydown', onKey);
}

function onKey(e) {
  if (!active) return;
  // Validate against the last queued direction (or current dir if queue empty)
  const q = state.inputQueue;
  const d = q.length > 0 ? q[q.length - 1] : state.dir;

  let newDir = null;
  if ((e.key === 'ArrowUp'    || e.key === 'w') && d.dr !== 1)  newDir = { dr: -1, dc: 0 };
  if ((e.key === 'ArrowDown'  || e.key === 's') && d.dr !== -1) newDir = { dr: 1, dc: 0 };
  if ((e.key === 'ArrowLeft'  || e.key === 'a') && d.dc !== 1)  newDir = { dr: 0, dc: -1 };
  if ((e.key === 'ArrowRight' || e.key === 'd') && d.dc !== -1) newDir = { dr: 0, dc: 1 };

  if (newDir) {
    q.push(newDir);
    // Cap queue at 3 to prevent buffering too far ahead
    if (q.length > 3) q.shift();
    e.preventDefault();
  }
  if (e.key === 'Escape') { stopSnake(); e.preventDefault(); }
  if (e.key === 'Enter' && !state.alive) {
    const go = document.querySelector('.snake-gameover');
    if (go) go.remove();
    state = newGame(); render(); e.preventDefault();
  }
}

export function stopSnake() {
  if (!active) return;
  active = false;
  if (tickId) { clearInterval(tickId); tickId = null; }
  document.removeEventListener('keydown', onKey);

  // Remove canvases and backdrops
  for (const wn of WALLS) {
    if (canvases[wn]) { canvases[wn].remove(); delete canvases[wn]; }
    if (backdrops[wn]) { backdrops[wn].remove(); delete backdrops[wn]; }
  }
  if (overlay) { overlay.remove(); overlay = null; }
  const go = document.querySelector('.snake-gameover');
  if (go) go.remove();
  state = null;
  if (exitCallback) exitCallback();
}
