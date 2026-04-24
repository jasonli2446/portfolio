export default {
  id: 'notes',
  title: 'Notes',
  icon: '📝',
  width: 440,
  height: 340,
  wall: 'back',
  openOnStart: false,
  offsetX: -300,
  offsetY: 220,
  content: () =>
    `<textarea class="notes-textarea" placeholder="Type anything here..."
       style="width:100%; height:100%;"
     >Welcome to 3D OS!\n\nThis is a spatial desktop environment.\nMove your head to look around.\nDrag windows by their title bar.\n\nTry typing here...</textarea>`,
};
