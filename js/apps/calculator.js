export default {
  id: 'calculator',
  title: 'Calculator',
  icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="2" width="16" height="20" rx="2"></rect><line x1="8" y1="6" x2="16" y2="6"></line><line x1="8" y1="10" x2="8" y2="10"></line><line x1="12" y1="10" x2="12" y2="10"></line><line x1="16" y1="10" x2="16" y2="10"></line><line x1="8" y1="14" x2="8" y2="14"></line><line x1="12" y1="14" x2="12" y2="14"></line><line x1="16" y1="14" x2="16" y2="14"></line><line x1="8" y1="18" x2="8" y2="18"></line><line x1="12" y1="18" x2="12" y2="18"></line><line x1="16" y1="18" x2="16" y2="18"></line></svg>',
  width: 260,
  height: 340,
  wall: 'right',
  openOnStart: false,
  content: () =>
    `<div class="calc-display">0</div>
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
  init: (win) => {
    const display = win.content.querySelector('.calc-display');
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

    win.content.addEventListener('click', (e) => {
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
  },
};
