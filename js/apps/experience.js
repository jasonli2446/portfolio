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
  width: 520,
  height: 440,
  wall: 'left',
  openOnStart: false,
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
