const terminalText = `$ whoami
jason-li — cs + ce @ cwru, 4.0 gpa

$ cat experience.txt

[1] Software Engineer Intern @ KKR
    Summer 2026
    > Incoming intern on the Data and AI team

[2] Technical Lead @ CWRU xLab – Dealer Tire
    Jan 2026 – Present
    > Leading 4 devs building conversational AI for account summaries
    > Two-agent architecture with dynamic checklist validation

[3] Software Engineer Intern @ 1848 Ventures
    May – Dec 2025
    > Architected scalable lead-gen platform (AWS/Terraform)
    > Built RAG pipelines and AI agents for 15+ ventures

[4] AI/ML Researcher @ EINSTEIN Lab, CWRU
    Jan 2025 – Present
    > SVD-based KV cache compression — 87.5% memory savings
    > PyTorch framework for multi-transformer architectures

[5] Software Engineer Intern @ Eaton Corporation
    Jan – May 2025
    > AI training platform with RAG-powered simulated customers
    > Reduced onboarding time by 40%
`;

let typewriterTimeout = null;

function processCommand(cmd) {
  if (cmd === 'help') {
    return '<span style="color:#4ade80;">Available commands:</span>\n  help, whoami, cat skills.txt, cat education.txt,\n  history, neofetch, sudo, clear, ls';
  }
  if (cmd === 'whoami' || cmd === 'whoami --verbose') {
    return cmd.includes('verbose')
      ? 'jason-li\n  Full Stack Engineer & Researcher\n  Case Western Reserve University\n  CS + CE Double Major, Econ & Math Minor\n  GPA: 4.0/4.0\n  Currently: Technical Lead @ CWRU xLab\n  Next: SWE Intern @ KKR (Summer 2026)'
      : 'jason-li';
  }
  if (cmd === 'cat skills.txt') {
    return '<span style="color:#22d3ee;">Languages:</span> Python, Go, Swift, C++, Java, C#, TypeScript, SQL\n<span style="color:#22d3ee;">Frameworks:</span> React, Next.js, React Native, PyTorch, Express, Tailwind, FastAPI\n<span style="color:#22d3ee;">Tools:</span> AWS, Terraform, Docker, Git, Firebase, Supabase, Snowflake';
  }
  if (cmd === 'cat education.txt') {
    return 'Case Western Reserve University (2023-2027)\nB.S. Computer Science & Computer Engineering\nMinor: Economics, Mathematics\nGPA: 4.0/4.0\n\nHonors: Dean\'s List (every sem), Tau Beta Pi,\n  Case Alumni Foundation Scholarship,\n  Frank L. Merat Prize';
  }
  if (cmd === 'history') {
    return '  1  Learned to code (2018)\n  2  First hackathon (2023)\n  3  Started at CWRU (2023)\n  4  SWE Intern @ Eaton (Jan-May 2025)\n  5  AI/ML Researcher @ EINSTEIN Lab (Jan 2025)\n  6  SWE Intern @ 1848 Ventures (May-Dec 2025)\n  7  Technical Lead @ xLab (Jan 2026)\n  8  Incoming @ KKR (Summer 2026)\n  9  Building 3D Portfolio (right now)';
  }
  if (cmd === 'neofetch') {
    return `<span style="color:#22d3ee;">       ╔══════════╗</span>       <span style="color:#4ade80;">jason-li</span>@<span style="color:#4ade80;">3d-os</span>
<span style="color:#22d3ee;">       ║  3D  OS  ║</span>       ──────────────
<span style="color:#22d3ee;">       ║  ┌────┐  ║</span>       <span style="color:#4ade80;">OS:</span> 3D Portfolio OS v1.0
<span style="color:#22d3ee;">       ║  │ JL │  ║</span>       <span style="color:#4ade80;">Host:</span> CSS 3D + Vanilla JS
<span style="color:#22d3ee;">       ║  └────┘  ║</span>       <span style="color:#4ade80;">Kernel:</span> MediaPipe Face Tracking
<span style="color:#22d3ee;">       ╚══════════╝</span>       <span style="color:#4ade80;">Shell:</span> Custom Terminal v1
                          <span style="color:#4ade80;">Resolution:</span> ${window.innerWidth}x${window.innerHeight}
                          <span style="color:#4ade80;">Theme:</span> Deep Space Purple
                          <span style="color:#4ade80;">Walls:</span> 5 (back, left, right, floor, ceiling)
                          <span style="color:#4ade80;">Uptime:</span> ${Math.floor(performance.now()/60000)}m`;
  }
  if (cmd.startsWith('sudo')) {
    return '<span style="color:#ef4444;">jason is not in the sudoers file. This incident will be reported.</span>';
  }
  if (cmd === 'ls') {
    return '<span style="color:rgba(100,180,255,0.8);">experience.txt</span>  <span style="color:rgba(100,180,255,0.8);">skills.txt</span>  <span style="color:rgba(100,180,255,0.8);">education.txt</span>  <span style="color:rgba(255,255,255,0.5);">.bashrc</span>';
  }
  if (cmd === 'clear') {
    return '__CLEAR__';
  }
  return `command not found: ${cmd}`;
}

function typeWriter(element, text, index = 0, onComplete = null) {
  if (index < text.length) {
    const char = text[index];
    const line = element.lastChild;

    if (char === '\n') {
      element.appendChild(document.createElement('br'));
    } else {
      // Determine the class based on line content
      const currentText = element.textContent;
      const lastLineStart = currentText.lastIndexOf('\n') + 1;
      const currentLine = currentText.substring(lastLineStart);

      let span = line;
      if (!span || span.tagName !== 'SPAN' || index === 0) {
        span = document.createElement('span');

        // Check what type of line we're starting
        if (char === '$') {
          span.className = 'term-prompt';
        } else if (char === '>') {
          span.className = 'term-dim';
        } else if (char === '[' && /^\[[\d]\]/.test(text.substring(index, index + 3))) {
          span.className = 'term-accent';
        }

        element.appendChild(span);
      }

      span.textContent += char;
    }

    // Determine delay
    let delay = 20;
    if (char === '$' || (text[index - 1] === '\n' && char === '\n')) {
      delay = 400; // Pause after command prompts or double newlines
    }

    // Auto-scroll the terminal container
    const term = element.closest('.term');
    if (term) term.scrollTop = term.scrollHeight;

    typewriterTimeout = setTimeout(() => typeWriter(element, text, index + 1, onComplete), delay);
  } else {
    if (onComplete) onComplete();
  }
}

export default {
  id: 'experience',
  title: 'Experience',
  icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>',
  width: 520,
  height: 440,
  wall: 'left',
  openOnStart: false,
  offsetX: 0,
  offsetY: -50,

  content: () =>
    `<div class="term">
      <div class="term-output" id="exp-output"></div>
      <div class="fm-term-input-row" id="exp-input-row" style="display:none;">
        <span class="term-prompt">$ </span>
        <input type="text" class="fm-term-input" id="exp-input" placeholder="try: help" autocomplete="off" spellcheck="false">
      </div>
    </div>`,

  init: (win) => {
    const output = win.element.querySelector('#exp-output');
    const inputRow = win.element.querySelector('#exp-input-row');
    const input = win.element.querySelector('#exp-input');

    let typewriterDone = false;

    function finishTypewriter() {
      if (typewriterDone) return;
      typewriterDone = true;
      // Cancel ongoing typewriter
      if (typewriterTimeout) { clearTimeout(typewriterTimeout); typewriterTimeout = null; }
      // Dump all remaining text at once
      output.innerHTML = '';
      const lines = terminalText.split('\n');
      for (const line of lines) {
        if (line.startsWith('$')) {
          output.innerHTML += `<span class="term-prompt">${line}</span><br>`;
        } else if (line.startsWith('>')) {
          output.innerHTML += `<span class="term-dim">${line}</span><br>`;
        } else if (/^\[[\d]\]/.test(line)) {
          output.innerHTML += `<span class="term-accent">${line}</span><br>`;
        } else {
          output.innerHTML += line + '<br>';
        }
      }
      if (inputRow) inputRow.style.display = '';
      if (input) input.focus();
      const term = win.element.querySelector('.term');
      if (term) term.scrollTop = term.scrollHeight;
    }

    // Enter key skips typewriter
    function onSkip(e) {
      if (e.key === 'Enter' && !typewriterDone) {
        finishTypewriter();
        document.removeEventListener('keydown', onSkip);
      }
    }
    document.addEventListener('keydown', onSkip);

    if (output) {
      typeWriter(output, terminalText, 0, () => {
        typewriterDone = true;
        document.removeEventListener('keydown', onSkip);
        if (inputRow) inputRow.style.display = '';
        if (input) input.focus();
      });
    }

    if (input) {
      input.addEventListener('keydown', (e) => {
        if (e.key !== 'Enter') return;
        e.stopPropagation();
        const cmd = input.value.trim();
        input.value = '';
        if (!cmd) return;

        // Echo command
        const echo = document.createElement('div');
        echo.style.marginTop = '6px';
        echo.innerHTML = `<span class="term-prompt">$ ${cmd}</span>`;
        output.appendChild(echo);

        // Process command
        const result = processCommand(cmd.toLowerCase());
        if (result === '__CLEAR__') {
          output.innerHTML = '';
          return;
        }
        const resp = document.createElement('div');
        resp.style.cssText = 'color:rgba(255,255,255,0.6); margin:4px 0; white-space:pre-wrap;';
        resp.innerHTML = result;
        output.appendChild(resp);

        // Scroll
        const term = win.element.querySelector('.term');
        if (term) term.scrollTop = term.scrollHeight;
      });
    }
  },

  destroy: (win) => {
    if (typewriterTimeout) {
      clearTimeout(typewriterTimeout);
      typewriterTimeout = null;
    }
  }
};
