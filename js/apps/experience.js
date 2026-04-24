const terminalText = `$ whoami
jason-li

$ cat experience.txt

[1] Technical Lead @ [Company]
    Jan 2026 – Present
    > [Bullet point placeholder]
    > [Bullet point placeholder]

[2] SWE Intern @ [Company]
    May – Dec 2025
    > [Bullet point placeholder]

[3] AI/ML Researcher @ [Company]
    Jan 2025 – Present
    > [Bullet point placeholder]

[4] SWE Intern @ [Company]
    Jan – May 2025
    > [Bullet point placeholder]

$ `;

let typewriterTimeout = null;

function typeWriter(element, text, index = 0) {
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

    typewriterTimeout = setTimeout(() => typeWriter(element, text, index + 1), delay);
  }
}

export default {
  id: 'experience',
  title: 'Experience',
  icon: '💼',
  width: 500,
  height: 400,
  wall: 'left',
  openOnStart: true,
  offsetX: 0,
  offsetY: -50,

  content: () =>
    `<div class="term">
      <div class="term-output"></div>
      <span class="term-cursor">█</span>
    </div>`,

  init: (win) => {
    const output = win.element.querySelector('.term-output');
    if (output) {
      typeWriter(output, terminalText);
    }
  },

  destroy: (win) => {
    if (typewriterTimeout) {
      clearTimeout(typewriterTimeout);
      typewriterTimeout = null;
    }
  }
};
