console.log("MAIN-TERMINAL loaded");
import { createFUIWindow } from "../core/template.js";

// =====================
// TERMINAL STATE
// =====================

const terminalState = {
  history: [
    { type: "output", text: "WikiLeaks Terminal v2.4.1" },
    { type: "output", text: "Secure connection established" },
    { type: "output", text: "Type 'help' for commands" },
    { type: "prompt", text: "user@wikileaks:~$" },
  ],
};

// =====================
// RENDER
// =====================

function renderLine(line) {
  if (line.type === "prompt") {
    return `<div class="term-prompt">${line.text}<span class="term-cursor">_</span></div>`;
  }
  return `<div class="term-output">${line.text}</div>`;
}

function render() {
  return `
    <div class="terminal">
      <div class="terminal-header">TERMINAL</div>
      <div class="terminal-divider"></div>
      
      <div class="terminal-content">
        ${terminalState.history.map(renderLine).join("")}
      </div>
      
      <div class="terminal-footer">
        <span>[CTRL+C] Interrupt</span>
        <span>[CTRL+L] Clear</span>
      </div>
    </div>
  `;
}

// =====================
// FUI WINDOW INSTANCE
// =====================

export const terminalWindow = createFUIWindow({
  id: "main-terminal",
  render,
  update: null, // Pas d'update auto
  interval: null, // Static content
  defaultMode: "default",
});

// =====================
// PUBLIC API
// =====================

export function startMainTerminal() {
  terminalWindow.start();
  console.log("✅ Main Terminal started");
}

export function stopMainTerminal() {
  terminalWindow.stop();
  console.log("⏹️ Main Terminal stopped");
}