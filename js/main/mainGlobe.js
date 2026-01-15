// // =====================================================
// // MAIN - WORLD MAP / GLOBE
// // ASCII art globe with connection visualization
// // =====================================================

// const GLOBE_ART = `
//      .---.
//     /     \\
//    | () () |
//     \\  ^  /
//      |||||
//      |||||
   
//    ◉ EU  ◉ US
//    ◉ ASIA ◉ SA
// `;

// const GLOBE_DETAILED = `
//         .-''''-.
//       .'        '.
//      /   ◉ NA     \\
//     |              |
//     |   ◉ EU      |
//     |       ◉ AS  |
//      \\  ◉ AF     /
//       '.  ◉ SA .'
//         '-..-'
//          ||
//     OCEANIA ◉
// `;

// const LOCATIONS = [
//   { name: "North America", code: "NA", lat: 40, lon: -100 },
//   { name: "Europe", code: "EU", lat: 50, lon: 10 },
//   { name: "Asia", code: "AS", lat: 35, lon: 100 },
//   { name: "Africa", code: "AF", lat: 0, lon: 20 },
//   { name: "South America", code: "SA", lat: -15, lon: -60 },
//   { name: "Oceania", code: "OC", lat: -25, lon: 135 },
// ];

// let activeConnections = [];
// let stats = {
//   totalNodes: 47,
//   activeLinks: 23,
//   dataTransferred: 0,
//   uptime: 523441,
// };

// function updateStats() {
//   stats.dataTransferred += Math.random() * 50 + 10;
//   stats.activeLinks += Math.random() > 0.5 ? 1 : -1;
//   stats.activeLinks = Math.max(15, Math.min(35, stats.activeLinks));
//   stats.uptime += 1;
  
//   // Update active connections
//   if (Math.random() > 0.7 && activeConnections.length < 8) {
//     const from = LOCATIONS[Math.floor(Math.random() * LOCATIONS.length)];
//     const to = LOCATIONS[Math.floor(Math.random() * LOCATIONS.length)];
//     if (from !== to) {
//       activeConnections.push({
//         id: Date.now(),
//         from: from.code,
//         to: to.code,
//         strength: Math.random(),
//       });
//     }
//   }
  
//   // Remove old connections
//   if (activeConnections.length > 0 && Math.random() > 0.8) {
//     activeConnections.shift();
//   }
// }

// function formatBytes(bytes) {
//   if (bytes < 1024) return `${bytes.toFixed(0)}B`;
//   if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)}KB`;
//   if (bytes < 1073741824) return `${(bytes / 1048576).toFixed(1)}MB`;
//   return `${(bytes / 1073741824).toFixed(2)}GB`;
// }

// function formatUptime(seconds) {
//   const days = Math.floor(seconds / 86400);
//   const hours = Math.floor((seconds % 86400) / 3600);
//   return `${days}d ${hours}h`;
// }

// function renderConnection(conn) {
//   const strength = "█".repeat(Math.floor(conn.strength * 5)).padEnd(5, "░");
//   return `
// <div class="globe-connection">
//   <span class="conn-from">${conn.from}</span>
//   <span class="conn-arrow">←→</span>
//   <span class="conn-to">${conn.to}</span>
//   <span class="conn-strength">${strength}</span>
// </div>
//   `;
// }

// function render() {
//   return `
// <div class="main-globe">
//   <div class="globe-header">GLOBAL NETWORK</div>
  
//   <div class="globe-art">
// <pre>${GLOBE_DETAILED}</pre>
//   </div>
  
//   <div class="globe-divider"></div>
  
//   <div class="globe-stats">
//     <div class="stat-row">
//       <span class="stat-label">Nodes:</span>
//       <span class="stat-value">${stats.totalNodes}</span>
//     </div>
//     <div class="stat-row">
//       <span class="stat-label">Active Links:</span>
//       <span class="stat-value">${stats.activeLinks}</span>
//     </div>
//     <div class="stat-row">
//       <span class="stat-label">Data:</span>
//       <span class="stat-value">${formatBytes(stats.dataTransferred)}</span>
//     </div>
//     <div class="stat-row">
//       <span class="stat-label">Uptime:</span>
//       <span class="stat-value">${formatUptime(stats.uptime)}</span>
//     </div>
//   </div>
  
//   <div class="globe-divider"></div>
  
//   <div class="globe-connections">
//     <div class="connections-title">Active Links:</div>
//     ${activeConnections.length > 0 ? activeConnections.map(renderConnection).join("") : '<div class="connections-empty">No active connections</div>'}
//   </div>
// </div>
//   `;
// }

// export function renderMainGlobe() {
//   updateStats();
//   const el = document.getElementById("main-globe");
//   if (!el) return;
//   el.innerHTML = render();
// }

// // Initialize with some connections
// for (let i = 0; i < 3; i++) {
//   const from = LOCATIONS[Math.floor(Math.random() * LOCATIONS.length)];
//   const to = LOCATIONS[Math.floor(Math.random() * LOCATIONS.length)];
//   if (from !== to) {
//     activeConnections.push({
//       id: Date.now() + i,
//       from: from.code,
//       to: to.code,
//       strength: Math.random(),
//     });
//   }
// }

// // Auto-update every 2 seconds
// setInterval(() => {
//   renderMainGlobe();
// }, 2000);

// renderMainGlobe();