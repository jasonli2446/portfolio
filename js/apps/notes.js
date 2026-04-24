export default {
  id: 'notes',
  title: 'Notes',
  icon: '📝',
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
