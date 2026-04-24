export default {
  id: 'notes',
  title: 'README',
  icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>',
  width: 580,
  height: 620,
  wall: 'back',
  openOnStart: true,
  offsetX: 0,
  offsetY: 0,
  content: () =>
    `<textarea class="notes-textarea" placeholder="Type anything here..."
       style="width:100%; height:100%;"
     ># README.md

## Welcome to Jason Li's 3D Portfolio!

### How to Navigate
- **Drag** windows by their title bar
- **Double-click** title bar to fullscreen
- **Resize** from bottom-right corner
- **─** minimizes, **✕** closes (reopen from dock)
- **Double-click** desktop icons to open apps
- **Right-click** the desktop for options

### Head Tracking
- If you enabled camera, **move your head**
  to look around the 3D room
- Toggle with the camera button in the menu bar

### Apps to Explore
- **About Me** — who I am (Get Info style)
- **Projects** — my work (file manager)
- **Experience** — resume (terminal)
- **Settings** — skills, contact, resume download

### Built With
- Pure CSS 3D (perspective + perspective-origin)
- MediaPipe Face Tracking
- Vanilla JS — no frameworks

*Feel free to type here — this is a real notepad!*</textarea>`,
};
