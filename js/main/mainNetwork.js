console.log("MAIN-NETWORK loaded");
import { createFUIWindow } from "../core/template.js";

// =====================
// NETWORK DATA
// =====================

const connections = [
  { ip: "192.168.1.1", status: "ACTIVE", latency: 12, type: "LOCAL" },
  { ip: "10.0.0.5", status: "ACTIVE", latency: 8, type: "INTERNAL" },
  { ip: "172.16.0.10", status: "IDLE", latency: 45, type: "VPN" },
  { ip: "203.0.113.42", status: "ACTIVE", latency: 125, type: "EXTERNAL" },
];

// =====================
// HELPERS
// =====================

function randomFluctuation(value, min, max, delta) {
  const change = (Math.random() - 0.5) * delta;
  return Math.max(min, Math.min(max, value + change));
}

// =====================
// RENDER
// =====================

function renderConnection(conn) {
  const statusClass = conn.status.toLowerCase();
  const latencyColor =
    conn.latency < 50 ? "good" : conn.latency < 100 ? "warn" : "bad";

  return `
    <div class="network-row">
      <span class="network-ip">${conn.ip}</span>
      <span class="network-status ${statusClass}">${conn.status}</span>
      <span class="network-latency ${latencyColor}">${conn.latency}ms</span>
      <span class="network-type">${conn.type}</span>
    </div>
  `;
}

function render() {
  const totalActive = connections.filter((c) => c.status === "ACTIVE").length;
  const avgLatency = Math.round(
    connections.reduce((sum, c) => sum + c.latency, 0) / connections.length
  );

  return `
    <div class="network-monitor">
      <div class="network-header">NETWORK STATUS</div>
      <div class="network-divider"></div>
      
      <div class="network-summary">
        <span>Connections: ${totalActive}/${connections.length}</span>
        <span>Avg Latency: ${avgLatency}ms</span>
      </div>
      
      <div class="network-divider"></div>
      
      <div class="network-list">
        ${connections.map(renderConnection).join("")}
      </div>
    </div>
  `;
}

// =====================
// UPDATE
// =====================

function update() {
  connections.forEach((conn) => {
    // Fluctuate latency
    conn.latency = Math.round(
      randomFluctuation(conn.latency, 5, 200, 20)
    );

    // Random status changes
    if (Math.random() < 0.05) {
      conn.status = conn.status === "ACTIVE" ? "IDLE" : "ACTIVE";
    }
  });
}

// =====================
// FUI WINDOW INSTANCE
// =====================

export const networkWindow = createFUIWindow({
  id: "main-network",
  render,
  update,
  interval: 2000,
  defaultMode: "default",
});

// =====================
// PUBLIC API
// =====================

export function startMainNetwork() {
  networkWindow.start();
  console.log("✅ Main Network started");
}

export function stopMainNetwork() {
  networkWindow.stop();
  console.log("⏹️ Main Network stopped");
}