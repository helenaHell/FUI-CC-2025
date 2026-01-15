console.log("DEV-TERMINAL loaded");
import { createFUIWindow } from "../core/template.js";

// =====================
// TERMINAL STATE
// =====================

const terminalLines = [];
const MAX_LINES = 100;

// =====================
// HELPERS
// =====================

function generateHexCode() {
  const chars = "0123456789abcdefABCDEF";
  let hex = "";
  for (let i = 0; i < 6; i++) {
    hex += chars[Math.floor(Math.random() * chars.length)];
  }
  return `0x${hex}UI`;
}

function generateLine() {
  // Generate 3 hex codes per line
  return `${generateHexCode()}, ${generateHexCode()}, ${generateHexCode()},`;
}

// =====================
// RENDER
// =====================

function render() {
  return `
    <div class="dev-terminal">
      <div class="term-prompt">></div>
      <div class="term-prompt">>  *Terminal*</div>
      <div class="term-prompt">></div>
      <div class="term-separator">----------------</div>
      <div class="term-content">
        ${terminalLines.join("\n")}
      </div>
    </div>
  `;
}

// =====================
// UPDATE
// =====================

function update() {
  // Add new line
  terminalLines.push(generateLine());

  // Limit lines
  if (terminalLines.length > MAX_LINES) {
    terminalLines.shift();
  }

  // Auto-scroll after render
  setTimeout(() => {
    const content = document.querySelector("#dev-terminal .term-content");
    if (content) {
      content.scrollTop = content.scrollHeight;
    }
  }, 10);
}

// =====================
// INIT
// =====================

function initialize() {
  // Start with 30 lines
  for (let i = 0; i < 30; i++) {
    terminalLines.push(generateLine());
  }
}

// =====================
// FUI WINDOW INSTANCE
// =====================

export const devTerminalWindow = createFUIWindow({
  id: "dev-terminal",
  render,
  update,
  interval: 500, // New line every 500ms
  defaultMode: "default",
});

// =====================
// PUBLIC API
// =====================

export function startDevTerminal() {
  if (terminalLines.length === 0) initialize();
  devTerminalWindow.start();
  console.log("✅ Dev Terminal started");
}

export function stopDevTerminal() {
  devTerminalWindow.stop();
  console.log("⏹️ Dev Terminal stopped");
}