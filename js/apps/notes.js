export default {
  id: 'notes',
  title: 'Notes',
  icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>',
  width: 520,
  height: 480,
  wall: 'back',
  openOnStart: true,
  offsetX: 0,
  offsetY: 0,
  content: () =>
    `<textarea class="notes-textarea" placeholder="Type anything here..."
       style="width:100%; height:100%;"
     >Welcome to Jason Li's 3D Portfolio!\n\n` +
    `HOW TO NAVIGATE\n` +
    `─────────────────────────\n` +
    `• Drag windows by their title bar\n` +
    `• Double-click title bar to fullscreen\n` +
    `• Resize from bottom-right corner\n` +
    `• ─ minimizes, ✕ closes (reopen from dock)\n` +
    `• Double-click desktop icons to open apps\n` +
    `• Right-click the desktop for options\n\n` +
    `HEAD TRACKING\n` +
    `─────────────────────────\n` +
    `• If you enabled camera, move your head\n` +
    `  to look around the 3D room\n` +
    `• Toggle with 📷 in the menu bar\n\n` +
    `EXPLORE\n` +
    `─────────────────────────\n` +
    `• About Me — who I am (Get Info style)\n` +
    `• Projects — my work (file manager)\n` +
    `• Experience — resume (terminal)\n` +
    `• Settings — skills, contact, resume\n\n` +
    `Feel free to type here — this is a real notepad!</textarea>`,
};
