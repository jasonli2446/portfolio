import { windows } from '../windows.js';

export default {
  id: 'sysmonitor',
  title: 'System Monitor',
  icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line><polyline points="6 10 9 7 12 10 15 7 18 10"></polyline></svg>',
  width: 320,
  height: 280,
  wall: 'left',
  openOnStart: false,
  content: () => `<div class="sysmon" id="sysmon"></div>`,
  init: (win) => {
    const container = win.element.querySelector('#sysmon');
    let rafId;

    function update() {
      const openWindows = windows.filter(w => w.state === 'normal' || w.state === 'fullscreen').length;
      const hiddenWindows = windows.filter(w => w.state === 'hidden').length;
      const totalClones = windows.reduce((sum, w) => sum + (w._clones ? w._clones.size : 0), 0);
      const fps = Math.round(30 + Math.random() * 30);
      const mem = (openWindows * 2.4 + totalClones * 0.8).toFixed(1);
      const uptime = Math.floor(performance.now() / 1000);
      const mins = Math.floor(uptime / 60);
      const secs = uptime % 60;

      container.innerHTML = `
        <div class="sysmon-header">System Activity</div>
        <div class="sysmon-row">
          <span class="sysmon-label">Walls</span>
          <span class="sysmon-val">5 active</span>
          <span class="sysmon-bar"><span class="sysmon-bar-fill" style="width:100%; background:rgba(100,200,150,0.6);"></span></span>
        </div>
        <div class="sysmon-row">
          <span class="sysmon-label">Windows</span>
          <span class="sysmon-val">${openWindows} open, ${hiddenWindows} hidden</span>
          <span class="sysmon-bar"><span class="sysmon-bar-fill" style="width:${Math.min(100, openWindows * 12)}%; background:rgba(100,160,255,0.6);"></span></span>
        </div>
        <div class="sysmon-row">
          <span class="sysmon-label">Clones</span>
          <span class="sysmon-val">${totalClones} active</span>
          <span class="sysmon-bar"><span class="sysmon-bar-fill" style="width:${Math.min(100, totalClones * 20)}%; background:rgba(200,160,60,0.6);"></span></span>
        </div>
        <div class="sysmon-row">
          <span class="sysmon-label">Render</span>
          <span class="sysmon-val">${fps} fps</span>
          <span class="sysmon-bar"><span class="sysmon-bar-fill" style="width:${fps}%; background:rgba(100,200,150,0.6);"></span></span>
        </div>
        <div class="sysmon-row">
          <span class="sysmon-label">Memory</span>
          <span class="sysmon-val">${mem} MB</span>
          <span class="sysmon-bar"><span class="sysmon-bar-fill" style="width:${Math.min(100, mem * 3)}%; background:rgba(200,100,100,0.5);"></span></span>
        </div>
        <div class="sysmon-row">
          <span class="sysmon-label">Uptime</span>
          <span class="sysmon-val">${mins}m ${secs}s</span>
          <span class="sysmon-bar"><span class="sysmon-bar-fill" style="width:${Math.min(100, uptime / 6)}%; background:rgba(140,100,220,0.5);"></span></span>
        </div>
      `;

      rafId = requestAnimationFrame(update);
    }
    update();

    win._sysmonRaf = rafId;
  },
  destroy: (win) => {
    if (win._sysmonRaf) cancelAnimationFrame(win._sysmonRaf);
  },
};
