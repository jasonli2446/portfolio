import { windows } from '../windows.js';

// Rolling history for sparkline charts
const HISTORY_LEN = 30;
const cpuHistory = new Array(HISTORY_LEN).fill(20);
const memHistory = new Array(HISTORY_LEN).fill(5);
const netHistory = new Array(HISTORY_LEN).fill(0);

function sparkline(data, color, maxVal) {
  const w = 120, h = 28;
  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - (Math.min(v, maxVal) / maxVal) * h;
    return `${x},${y}`;
  }).join(' ');

  return `<svg width="${w}" height="${h}" style="display:block;">
    <polyline points="${points}" fill="none" stroke="${color}" stroke-width="1.5" stroke-linejoin="round"/>
    <polyline points="0,${h} ${points} ${w},${h}" fill="${color.replace(')', ',0.1)')}" stroke="none"/>
  </svg>`;
}

export default {
  id: 'sysmonitor',
  title: 'System Monitor',
  icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line><polyline points="6 10 9 7 12 10 15 7 18 10"></polyline></svg>',
  width: 340,
  height: 380,
  wall: 'left',
  showInDock: false,
  openOnStart: false,
  content: () => `<div class="sysmon" id="sysmon"></div>`,
  init: (win) => {
    const container = win.element.querySelector('#sysmon');
    let frameCount = 0;
    let lastFpsTime = performance.now();
    let currentFps = 60;

    function update() {
      // Calculate real FPS
      frameCount++;
      const now = performance.now();
      if (now - lastFpsTime >= 1000) {
        currentFps = frameCount;
        frameCount = 0;
        lastFpsTime = now;
      }

      const openWindows = windows.filter(w => w.state === 'normal' || w.state === 'fullscreen').length;
      const hiddenWindows = windows.filter(w => w.state === 'hidden').length;
      const totalClones = windows.reduce((sum, w) => sum + (w._clones ? w._clones.size : 0), 0);
      const uptime = Math.floor(performance.now() / 1000);
      const mins = Math.floor(uptime / 60);
      const secs = String(uptime % 60).padStart(2, '0');

      // Simulated metrics with gentle drift
      const cpu = 15 + openWindows * 8 + totalClones * 3 + Math.sin(now * 0.001) * 3;
      const mem = openWindows * 2.4 + totalClones * 0.8 + 4 + Math.sin(now * 0.0005) * 0.5;
      const net = totalClones * 12 + 10 + Math.sin(now * 0.0008) * 8;

      cpuHistory.push(cpu); cpuHistory.shift();
      memHistory.push(mem); memHistory.shift();
      netHistory.push(net); netHistory.shift();

      container.innerHTML = `
        <div class="sysmon-header">
          <span>System Activity</span>
          <span class="sysmon-uptime">${mins}:${secs}</span>
        </div>

        <div class="sysmon-metric">
          <div class="sysmon-metric-header">
            <span class="sysmon-metric-label">CPU</span>
            <span class="sysmon-metric-val" style="color:rgba(100,200,150,0.9);">${cpu.toFixed(1)}%</span>
          </div>
          ${sparkline(cpuHistory, 'rgba(100,200,150,0.7)', 100)}
        </div>

        <div class="sysmon-metric">
          <div class="sysmon-metric-header">
            <span class="sysmon-metric-label">Memory</span>
            <span class="sysmon-metric-val" style="color:rgba(100,160,255,0.9);">${mem.toFixed(1)} MB</span>
          </div>
          ${sparkline(memHistory, 'rgba(100,160,255,0.7)', 40)}
        </div>

        <div class="sysmon-metric">
          <div class="sysmon-metric-header">
            <span class="sysmon-metric-label">Network</span>
            <span class="sysmon-metric-val" style="color:rgba(200,160,60,0.9);">${net.toFixed(0)} KB/s</span>
          </div>
          ${sparkline(netHistory, 'rgba(200,160,60,0.7)', 100)}
        </div>

        <div class="sysmon-stats">
          <div class="sysmon-stat"><span class="sysmon-stat-num">${openWindows}</span><span class="sysmon-stat-label">Windows</span></div>
          <div class="sysmon-stat"><span class="sysmon-stat-num">${hiddenWindows}</span><span class="sysmon-stat-label">Hidden</span></div>
          <div class="sysmon-stat"><span class="sysmon-stat-num">${totalClones}</span><span class="sysmon-stat-label">Clones</span></div>
          <div class="sysmon-stat"><span class="sysmon-stat-num">${currentFps}</span><span class="sysmon-stat-label">FPS</span></div>
          <div class="sysmon-stat"><span class="sysmon-stat-num">5</span><span class="sysmon-stat-label">Walls</span></div>
        </div>
      `;

      win._sysmonRaf = requestAnimationFrame(update);
    }

    // Update at ~2fps for the charts (not every frame)
    let lastUpdate = 0;
    function throttledUpdate() {
      const now = performance.now();
      frameCount++; // still count frames for FPS
      if (now - lastFpsTime >= 1000) {
        currentFps = frameCount;
        frameCount = 0;
        lastFpsTime = now;
      }
      if (now - lastUpdate > 5000) {
        lastUpdate = now;
        update();
      }
      win._sysmonRaf = requestAnimationFrame(throttledUpdate);
    }
    throttledUpdate();
  },
  destroy: (win) => {
    if (win._sysmonRaf) cancelAnimationFrame(win._sysmonRaf);
  },
};
