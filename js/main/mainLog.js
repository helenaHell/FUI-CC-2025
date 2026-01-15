console.log("MAIN-LOG loaded");
import { createFUIWindow } from "../core/template.js";

// =====================
// LOG DATA
// =====================

const LOG_TYPES = {
  SYSTEM: ["Boot sequence", "Module loaded", "Service started", "Connection established"],
  SECURITY: ["Auth success", "Key verified", "Encryption enabled", "Tunnel active"],
  NETWORK: ["Packet sent", "Response received", "Latency spike", "Route updated"],
  ERROR: ["Timeout", "Retry failed", "Connection lost", "Invalid response"],
};

const logs = [];
const MAX_LOGS = 50;

// =====================
// FACTORY
// =====================

function createLog() {
  const types = Object.keys(LOG_TYPES);
  const type = types[Math.floor(Math.random() * types.length)];
  const messages = LOG_TYPES[type];
  const message = messages[Math.floor(Math.random() * messages.length)];

  const timestamp = new Date().toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  return {
    timestamp,
    type,
    message,
    id: crypto.randomUUID(),
  };
}

// =====================
// RENDER
// =====================

function renderLog(log) {
  const typeClass = log.type.toLowerCase();

  return `
    <div class="log-entry ${typeClass}">
      <span class="log-time">${log.timestamp}</span>
      <span class="log-type">[${log.type}]</span>
      <span class="log-message">${log.message}</span>
    </div>
  `;
}

function render() {
  return `
    <div class="activity-log">
      <div class="log-header">ACTIVITY LOG</div>
      <div class="log-divider"></div>
      
      <div class="log-stream">
        ${logs.map(renderLog).join("")}
      </div>
      
      <div class="log-footer">
        <span>${logs.length} entries</span>
        <span>Live feed</span>
      </div>
    </div>
  `;
}

// =====================
// UPDATE
// =====================

function update() {
  // Add new log
  logs.push(createLog());

  // Limit log size
  if (logs.length > MAX_LOGS) {
    logs.shift();
  }

  // Auto-scroll to bottom after render
  setTimeout(() => {
    const stream = document.querySelector("#main-log .log-stream");
    if (stream) {
      stream.scrollTop = stream.scrollHeight;
    }
  }, 10);
}

// =====================
// FUI WINDOW INSTANCE
// =====================

export const logWindow = createFUIWindow({
  id: "main-log",
  render,
  update,
  interval: 2000,
  defaultMode: "default",
});

// =====================
// PUBLIC API
// =====================

export function startMainLog() {
  // Start with some initial logs
  if (logs.length === 0) {
    for (let i = 0; i < 10; i++) {
      logs.push(createLog());
    }
  }
  
  logWindow.start();
  console.log("✅ Main Log started");
}

export function stopMainLog() {
  logWindow.stop();
  console.log("⏹️ Main Log stopped");
}