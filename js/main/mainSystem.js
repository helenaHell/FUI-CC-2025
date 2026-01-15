console.log("MAIN-SYSTEM loaded");
import { createFUIWindow } from "../core/template.js";

// =====================
// SYSTEM STATS
// =====================

const stats = {
  cpu: 0,
  ram: 0,
  disk: 0,
  temp: 0,
  network: 0,
};

// =====================
// HELPERS
// =====================

function randomFluctuation(value, min, max, delta) {
  const change = (Math.random() - 0.5) * delta;
  return Math.max(min, Math.min(max, value + change));
}

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes}B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
}

// =====================
// RENDER
// =====================

function renderStatBar(label, value, max = 100, unit = "%") {
  const percentage = Math.round((value / max) * 100);
  const bars = Math.floor(percentage / 10);
  const barString = "█".repeat(bars) + "░".repeat(10 - bars);

  return `
    <div class="stat-row">
      <span class="stat-label">${label}:</span>
      <span class="stat-bar">${barString}</span>
      <span class="stat-value">${value.toFixed(1)}${unit}</span>
    </div>
  `;
}

function render() {
  return `
    <div class="system-monitor">
      <div class="monitor-header">SYSTEM STATUS</div>
      <div class="monitor-divider"></div>
      
      <div class="monitor-stats">
        ${renderStatBar("CPU", stats.cpu)}
        ${renderStatBar("RAM", stats.ram)}
        ${renderStatBar("DISK", stats.disk)}
        ${renderStatBar("TEMP", stats.temp, 100, "°C")}
        ${renderStatBar("NET", stats.network, 100, "Mbps")}
      </div>
      
      <div class="monitor-footer">
        <span>Uptime: ${Math.floor(Date.now() / 1000 / 60)}m</span>
        <span>Processes: ${Math.floor(Math.random() * 50 + 100)}</span>
      </div>
    </div>
  `;
}

// =====================
// UPDATE
// =====================

function update() {
  stats.cpu = randomFluctuation(stats.cpu, 10, 95, 10);
  stats.ram = randomFluctuation(stats.ram, 30, 85, 5);
  stats.disk = randomFluctuation(stats.disk, 40, 75, 2);
  stats.temp = randomFluctuation(stats.temp, 35, 70, 3);
  stats.network = randomFluctuation(stats.network, 5, 90, 15);
}

// =====================
// INIT
// =====================

function initialize() {
  stats.cpu = 45;
  stats.ram = 62;
  stats.disk = 58;
  stats.temp = 52;
  stats.network = 35;
}

// =====================
// FUI WINDOW INSTANCE
// =====================

export const systemWindow = createFUIWindow({
  id: "main-system",
  render,
  update,
  interval: 1000,
  defaultMode: "default",
});

// =====================
// PUBLIC API
// =====================

export function startMainSystem() {
  initialize();
  systemWindow.start();
  console.log("✅ Main System started");
}

export function stopMainSystem() {
  systemWindow.stop();
  console.log("⏹️ Main System stopped");
}