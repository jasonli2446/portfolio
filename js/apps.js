import { createWindow, centerWindow } from './windows.js';

export function initApps() {
  const backWall  = document.querySelector('.wall-back');
  const leftWall  = document.querySelector('.wall-left');
  const rightWall = document.querySelector('.wall-right');

  // 1. Notes — on the back wall
  const notesWin = createWindow('Notes', 500, 380,
    `<textarea class="notes-textarea" placeholder="Type anything here..."
       style="width:100%; height:100%;"
     >Welcome to 3D OS!\n\nThis is a spatial desktop environment.\nMove your head to look around.\nDrag windows by their title bar.\n\nTry typing here...</textarea>`,
    backWall
  );
  centerWindow(notesWin);

  // 2. Calculator — on the right wall
  const calcWin = createWindow('Calculator', 280, 380,
    `<div class="calc-display" id="calc-display">0</div>
     <div class="calc-grid">
       <button class="calc-btn calc-btn-clear" data-action="clear">C</button>
       <button class="calc-btn calc-btn-op" data-action="sign">+/-</button>
       <button class="calc-btn calc-btn-op" data-action="percent">%</button>
       <button class="calc-btn calc-btn-op" data-op="/">÷</button>
       <button class="calc-btn calc-btn-num" data-num="7">7</button>
       <button class="calc-btn calc-btn-num" data-num="8">8</button>
       <button class="calc-btn calc-btn-num" data-num="9">9</button>
       <button class="calc-btn calc-btn-op" data-op="*">×</button>
       <button class="calc-btn calc-btn-num" data-num="4">4</button>
       <button class="calc-btn calc-btn-num" data-num="5">5</button>
       <button class="calc-btn calc-btn-num" data-num="6">6</button>
       <button class="calc-btn calc-btn-op" data-op="-">−</button>
       <button class="calc-btn calc-btn-num" data-num="1">1</button>
       <button class="calc-btn calc-btn-num" data-num="2">2</button>
       <button class="calc-btn calc-btn-num" data-num="3">3</button>
       <button class="calc-btn calc-btn-op" data-op="+">+</button>
       <button class="calc-btn calc-btn-num" data-num="0" style="grid-column: span 2;">0</button>
       <button class="calc-btn calc-btn-num" data-num=".">.</button>
       <button class="calc-btn calc-btn-eq" data-action="equals">=</button>
     </div>`,
    rightWall
  );
  centerWindow(calcWin);

  // Calculator logic
  {
    const display = calcWin.content.querySelector('#calc-display');
    let current = '0', previous = null, operator = null, resetNext = false;

    function updateDisplay() { display.textContent = current; }
    function compute(a, b, op) {
      switch (op) {
        case '+': return a + b;
        case '-': return a - b;
        case '*': return a * b;
        case '/': return b !== 0 ? a / b : 'Error';
        default: return b;
      }
    }

    calcWin.content.addEventListener('click', (e) => {
      const btn = e.target.closest('.calc-btn');
      if (!btn) return;
      e.stopPropagation();

      if (btn.dataset.num !== undefined) {
        const n = btn.dataset.num;
        if (resetNext) { current = ''; resetNext = false; }
        if (n === '.' && current.includes('.')) return;
        current = current === '0' && n !== '.' ? n : current + n;
        updateDisplay();
      } else if (btn.dataset.op) {
        if (previous !== null && operator && !resetNext) {
          current = String(compute(parseFloat(previous), parseFloat(current), operator));
        }
        previous = current;
        operator = btn.dataset.op;
        resetNext = true;
        updateDisplay();
      } else if (btn.dataset.action === 'equals') {
        if (previous !== null && operator) {
          current = String(compute(parseFloat(previous), parseFloat(current), operator));
          previous = null; operator = null; resetNext = true;
          updateDisplay();
        }
      } else if (btn.dataset.action === 'clear') {
        current = '0'; previous = null; operator = null; resetNext = false;
        updateDisplay();
      } else if (btn.dataset.action === 'sign') {
        current = String(-parseFloat(current)); updateDisplay();
      } else if (btn.dataset.action === 'percent') {
        current = String(parseFloat(current) / 100); updateDisplay();
      }
    });
  }

  // 3. Clock — on the left wall
  const clockWin = createWindow('Clock', 260, 200,
    `<div class="clock-face">
       <div class="clock-time" id="clock-time">--:--</div>
       <div class="clock-seconds" id="clock-seconds">00</div>
       <div class="clock-date" id="clock-date">---</div>
     </div>`,
    leftWall
  );
  centerWindow(clockWin);

  {
    const timeEl = clockWin.content.querySelector('#clock-time');
    const secEl  = clockWin.content.querySelector('#clock-seconds');
    const dateEl = clockWin.content.querySelector('#clock-date');

    function updateClock() {
      const now = new Date();
      timeEl.textContent = `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`;
      secEl.textContent  = String(now.getSeconds()).padStart(2, '0');
      dateEl.textContent = now.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
      requestAnimationFrame(updateClock);
    }
    updateClock();
  }
}
