// 4D Tesseract (hypercube) wireframe with hand tracking control

import { IS_MOBILE } from './config.js';

export function showTesseract() {
  if (document.querySelector('.tesseract-canvas')) return;

  const canvas = document.createElement('canvas');
  canvas.className = 'tesseract-canvas';
  canvas.style.cssText = 'position:fixed; inset:0; width:100%; height:100%; z-index:15;';
  document.body.appendChild(canvas);

  const msg = document.createElement('div');
  msg.className = 'tesseract-msg';
  const msgPos = IS_MOBILE ? 'top:20px' : 'bottom:40px';
  msg.style.cssText = `position:fixed; ${msgPos}; left:50%; transform:translateX(-50%); text-align:center; z-index:16; pointer-events:none;`;
  msg.innerHTML = `
    <div style="font-size:13px; color:rgba(255,255,255,0.3); font-family:monospace; margin-bottom:4px;">4D Hypercube · click to dismiss</div>
  `;
  document.body.appendChild(msg);

  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  const cx = canvas.width / 2, cy = canvas.height / 2;

  // 16 vertices of a 4D hypercube
  const verts4D = [];
  for (let i = 0; i < 16; i++) {
    verts4D.push([
      (i & 1) ? 1 : -1,
      (i & 2) ? 1 : -1,
      (i & 4) ? 1 : -1,
      (i & 8) ? 1 : -1,
    ]);
  }

  // 32 edges: connect vertices differing in exactly one coordinate
  const edges = [];
  for (let i = 0; i < 16; i++) {
    for (let j = i + 1; j < 16; j++) {
      let diff = 0;
      for (let k = 0; k < 4; k++) if (verts4D[i][k] !== verts4D[j][k]) diff++;
      if (diff === 1) edges.push([i, j]);
    }
  }

  // ── Mouse drag ──────────────────────────────────
  let dragX = 0, dragY = 0;
  let isDragging = false;
  let didDrag = false;
  let lastMX = 0, lastMY = 0;

  canvas.addEventListener('pointerdown', (e) => {
    isDragging = true; didDrag = false;
    lastMX = e.clientX; lastMY = e.clientY;
    e.stopPropagation();
  });
  canvas.addEventListener('pointermove', (e) => {
    if (!isDragging) return;
    const dx = e.clientX - lastMX, dy = e.clientY - lastMY;
    if (Math.abs(dx) > 2 || Math.abs(dy) > 2) didDrag = true;
    dragX += dx * 0.005; dragY += dy * 0.005;
    lastMX = e.clientX; lastMY = e.clientY;
  });
  canvas.addEventListener('pointerup', () => isDragging = false);

  // ── Hand tracking ───────────────────────────────
  let handX = 0, handY = 0, handZ = 0;
  let handActive = false;
  let handLandmarker = null;
  let lastHandDetect = 0;
  let smoothHandX = 0, smoothHandY = 0;

  const videoEl = document.getElementById('webcam');
  const hasCamera = videoEl && videoEl.srcObject;

  // Update hint based on camera availability
  if (!hasCamera) {
    msg.innerHTML = `
      <div style="font-size:13px; color:rgba(255,255,255,0.3); font-family:monospace; margin-bottom:4px;">4D Hypercube · click to dismiss</div>
      <div style="font-size:11px; color:rgba(255,180,80,0.5); margin-top:4px;">Enable camera from the menu bar to control with your hand</div>
    `;
  }

  if (hasCamera) {
    import('https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/vision_bundle.mjs').then(async ({ HandLandmarker, FilesetResolver }) => {
      try {
        const vision = await FilesetResolver.forVisionTasks(
          'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/wasm',
        );
        handLandmarker = await HandLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath: 'https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task',
            delegate: 'GPU',
          },
          runningMode: 'VIDEO',
          numHands: 1,
        });
      } catch (e) {
        console.log('Hand tracking not available:', e);
      }
    });
  }

  function detectHand() {
    if (!handLandmarker || !videoEl || videoEl.readyState < 2) return;
    const now = performance.now();
    if (now - lastHandDetect < 66) return; // ~15fps
    lastHandDetect = now;
    try {
      const results = handLandmarker.detectForVideo(videoEl, now);
      if (results.landmarks && results.landmarks.length > 0) {
        const tip = results.landmarks[0][8];
        // 5x multiplier — small hand movements near center of frame cover full range
        smoothHandX += ((tip.x - 0.5) * -5 - smoothHandX) * 0.15;
        smoothHandY += ((tip.y - 0.5) * 5 - smoothHandY) * 0.15;
        handX = Math.max(-1.5, Math.min(1.5, smoothHandX));
        handY = Math.max(-1.5, Math.min(1.5, smoothHandY));
        // Z: hand back = bigger, hand forward = smaller
        handZ = Math.max(-1, Math.min(1.5, tip.z * 30 + 1.5));
        handActive = true;
      } else {
        handActive = false;
      }
    } catch (e) { handActive = false; }
  }

  // ── 4D math ─────────────────────────────────────
  function rotate4D(v, axw, ayw, axy, azw) {
    let [x, y, z, w] = v;
    let c = Math.cos(axw), s = Math.sin(axw);
    [x, w] = [x*c - w*s, x*s + w*c];
    c = Math.cos(ayw); s = Math.sin(ayw);
    [y, w] = [y*c - w*s, y*s + w*c];
    c = Math.cos(axy); s = Math.sin(axy);
    [x, y] = [x*c - y*s, x*s + y*c];
    c = Math.cos(azw); s = Math.sin(azw);
    [z, w] = [z*c - w*s, z*s + w*c];
    return [x, y, z, w];
  }

  let offsetX = 0, offsetY = 0, handScale = 1;

  function project(v4) {
    const w4 = 1 / (3 - v4[3]);
    const x3 = v4[0] * w4, y3 = v4[1] * w4, z3 = v4[2] * w4;
    const w3 = 1 / (3 - z3);
    const scale = 280 * handScale;
    return {
      x: cx + x3 * w3 * scale + offsetX,
      y: cy + y3 * w3 * scale + offsetY,
      depth: z3 + v4[3],
    };
  }

  // ── Render loop ─────────────────────────────────
  let rafId;
  const time0 = performance.now();

  function draw() {
    const t = (performance.now() - time0) * 0.001;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    detectHand();
    if (handActive) {
      // Use actual wall bounds for clamping
      const backWall = document.querySelector('.wall-back');
      const wallRect = backWall ? backWall.getBoundingClientRect() : { left: 0, right: canvas.width, top: 0, bottom: canvas.height };
      const maxX = (wallRect.right - wallRect.left) / 2 - 40;
      const maxY = (wallRect.bottom - wallRect.top) / 2 - 40;
      const wallCX = (wallRect.left + wallRect.right) / 2 - cx;
      const wallCY = (wallRect.top + wallRect.bottom) / 2 - cy;

      const targetX = wallCX + handX * maxX;
      const targetY = wallCY + handY * maxY;
      offsetX += (Math.max(-maxX + wallCX, Math.min(maxX + wallCX, targetX)) - offsetX) * 0.08;
      offsetY += (Math.max(-maxY + wallCY, Math.min(maxY + wallCY, targetY)) - offsetY) * 0.08;
      handScale += (Math.max(0.3, Math.min(4, 1 + handZ * 2)) - handScale) * 0.08;
      dragX += handX * 0.008;
      dragY += handY * 0.008;
    }

    const angleXW = t * 0.3 + dragX;
    const angleYW = t * 0.2 + dragY;
    const angleXY = t * 0.15;
    const angleZW = t * 0.25;

    const projected = verts4D.map(v => project(rotate4D(v, angleXW, angleYW, angleXY, angleZW)));

    // Edges — purple/blue neon matching site theme
    for (const [i, j] of edges) {
      const a = projected[i], b = projected[j];
      const avgDepth = (a.depth + b.depth) / 2;
      const alpha = 0.2 + (avgDepth + 2) * 0.2;
      // Deeper purple for far edges, brighter blue-purple for near
      const t2 = (avgDepth + 2) / 4; // 0 to 1
      const r = Math.round(80 + t2 * 80);    // 80-160
      const g = Math.round(40 + t2 * 60);    // 40-100
      const b_ = Math.round(200 + t2 * 55);  // 200-255
      ctx.strokeStyle = `rgba(${r}, ${g}, ${b_}, ${Math.max(0.1, Math.min(0.85, alpha))})`;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(b.x, b.y);
      ctx.stroke();
    }

    // Vertices — glowing purple dots
    for (const p of projected) {
      const alpha = 0.4 + (p.depth + 2) * 0.25;
      const r = 3 + (p.depth + 2) * 1;
      ctx.fillStyle = `rgba(140, 80, 220, ${Math.max(0.15, Math.min(1, alpha))})`;
      ctx.shadowColor = 'rgba(100, 40, 200, 0.6)';
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.arc(p.x, p.y, Math.max(1.5, r), 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
    }

    rafId = requestAnimationFrame(draw);
  }
  draw();

  // ── Close ───────────────────────────────────────
  const close = () => {
    cancelAnimationFrame(rafId);
    canvas.remove();
    msg.remove();
    document.removeEventListener('click', onClickClose);
    if (handLandmarker) { handLandmarker.close(); handLandmarker = null; }
  };

  function onClickClose(e) {
    if (e.target === canvas && didDrag) return;
    close();
  }
  setTimeout(() => document.addEventListener('click', onClickClose), 500);
}
