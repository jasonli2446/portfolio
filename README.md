# 3D Portfolio OS

A spatial portfolio website that looks and feels like a 3D desktop operating system. Built with pure CSS 3D transforms, face tracking via MediaPipe, and vanilla JavaScript — no frameworks.

**[Live Demo →](https://jasonli2446.github.io/portfolio)**

## Features

### 3D Room
- 5-wall room (back, left, right, floor, ceiling) built with CSS `perspective` + `perspective-origin`
- Face tracking parallax via MediaPipe — move your head to look around
- Ambient floating particles
- Smooth gradient wallpapers with subtle grid lines

### Window System
- Draggable, resizable windows on any wall surface
- Windows split across walls with clip-path + clones when dragged to edges
- Double-click titlebar to fullscreen, minimize button, close = hide (reopen from dock)
- Focus glow, per-wall z-ordering, open/close/minimize animations
- Cramer's rule screen→wall-local coordinate unprojection for accurate drag on perspective-transformed surfaces

### Apps
| App | Style | Description |
|-----|-------|-------------|
| **About Me** | macOS Get Info | Bio, metadata rows, collapsible section |
| **Projects** | Finder file manager | Folder grid, double-click opens terminal detail view with interactive commands |
| **Experience** | Terminal | Typewriter effect, then interactive shell (`whoami`, `neofetch`, `cat skills.txt`, `sudo`) |
| **Settings** | System Preferences | Skills, contact, resume download with category grid |
| **Transcript** | University portal | CWRU education, GPA, honors, coursework |
| **Notes/README** | Notepad | Editable intro guide |
| **Clock** | Clock widget | Live time display |
| **Now Playing** | Music player | Procedural lo-fi via Web Audio API |
| **Stickies** | Sticky notes | Editable, deletable, create new |
| **Calculator** | Calculator | Full arithmetic |
| **System Monitor** | Activity Monitor | Live sparkline charts for CPU, memory, network |
| **Trash** | Recycle bin | Lists and restores closed windows |
| **Snake** | 3D Snake game | Full-room game across all 5 walls |

### OS Features
- **Dock** — auto-shows open apps, permanent + temporary icons
- **Menu bar** — File, Edit, View, Help dropdowns with working actions
- **Desktop icons** — draggable across walls, selection rectangle, multi-select
- **Spotlight search** — `Ctrl+K` or `/` to search apps, projects, links
- **Notification center** — click the clock to see activity feed
- **Right-click context menu** — About This OS, View Source, Refresh
- **Boot screen** — intro with camera permission prompt
- **Camera toggle** — enable/disable face tracking from menu bar

### Easter Eggs
- **???** desktop icon → 4D tesseract wireframe, hand-trackable
- **Snake** → full-room 3D snake game across all 5 walls
- **`neofetch`** in Experience terminal → ASCII art system info
- **`sudo`** in terminal → "jason is not in the sudoers file"

## Tech Stack

- **Pure CSS 3D** — `perspective`, `perspective-origin`, `transform-style: preserve-3d`
- **MediaPipe Face Landmarker** — real-time face tracking for parallax
- **MediaPipe Hand Landmarker** — hand tracking for tesseract control
- **Web Audio API** — procedural lo-fi music generation
- **Vanilla JS** — ES modules, no build step, no framework
- **Cramer's rule** — analytical screen→wall coordinate unprojection

## Running Locally

```bash
# Any static file server works
npx serve .
# or
python3 -m http.server 8765
```

Open `http://localhost:8765` in a browser. Camera access is optional — the site works fully without it.

## Project Structure

```
index.html              — Shell
css/
  base.css              — Room, walls, overlays, menus
  windows.css           — Window chrome and animations
  dock.css              — Dock bar
  apps.css              — Per-app styles
js/
  main.js               — Entry point, boot sequence
  config.js             — Constants (depth, perspective, tracking)
  tracking.js           — Face tracking + perspective updates
  windows.js            — Window system (drag, resize, clones, state machine)
  dock.js               — Dock (register, launch, indicators)
  desktop.js            — Desktop icons (drag, select, clone)
  clones.js             — Generic clone system for wall-edge overflow
  menubar.js            — Menu bar + dropdowns
  spotlight.js          — Cmd+K search overlay
  notifications.js      — Notification center panel
  contextmenu.js        — Right-click menu
  particles.js          — Ambient floating particles
  boot.js               — Intro/boot screen
  cursor.js             — Cursor dot indicator per wall
  tesseract.js          — 4D hypercube easter egg + hand tracking
  snake.js              — 3D snake game
  ticker.js             — (unused, awards ticker removed)
  apps/
    index.js            — App registry
    about.js            — About Me (Get Info)
    projects.js         — Projects (file manager + terminal)
    experience.js       — Experience (terminal + interactive shell)
    skills.js           — Settings (skills, contact, resume)
    education.js        — Transcript
    notes.js            — README notepad
    clock.js            — Clock
    nowplaying.js       — Music player (Web Audio)
    stickies.js         — Sticky notes
    calculator.js       — Calculator
    sysmonitor.js       — System monitor
    trash.js            — Trash / recycle bin
    snake.js            — Snake app launcher
public/
    headshot.jpg        — Profile photo
    resume.pdf          — Resume PDF
    JasonLiTranscript.pdf
    fresh-apple-icon.webp
```

## Author

**Jason Li** — [GitHub](https://github.com/jasonli2446) · [LinkedIn](https://linkedin.com/in/jasonli2446) · jasonli2446@gmail.com
