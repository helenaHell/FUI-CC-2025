console.log("MAIN-MISSIONS loaded");
import { createFUIWindow } from "../core/template.js";

// =====================
// MISSION DATA
// =====================

const MISSION_NAMES = [
  "PRISM-LEAK",
  "VAULT-7",
  "CABLE-GATE",
  "DRONE-FILES",
  "TPP-DOCS",
  "SHADOW-BROKER",
];

const missions = [];
let missionCounter = 1;

// =====================
// FACTORY
// =====================

function createMission() {
  const name = MISSION_NAMES[Math.floor(Math.random() * MISSION_NAMES.length)];
  const id = `OP-${String(missionCounter++).padStart(3, "0")}`;

  return {
    id,
    name,
    progress: Math.random() * 100,
    status: Math.random() > 0.3 ? "ACTIVE" : "COMPLETE",
    eta: Math.floor(Math.random() * 3600) + 60,
  };
}

// =====================
// HELPERS
// =====================

function formatETA(seconds) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;

  if (h > 0) return `${h}h ${m}m`;
  if (m > 0) return `${m}m ${s}s`;
  return `${s}s`;
}

// =====================
// RENDER
// =====================

function renderMission(mission) {
  const statusClass = mission.status.toLowerCase();
  const progressBars = Math.floor(mission.progress / 10);
  const progressBar = "█".repeat(progressBars) + "░".repeat(10 - progressBars);

  return `
    <div class="mission-row">
      <span class="mission-id">${mission.id}</span>
      <span class="mission-name">${mission.name}</span>
      <span class="mission-progress">${progressBar}</span>
      <span class="mission-status ${statusClass}">${mission.status}</span>
      <span class="mission-eta">${mission.status === "ACTIVE" ? formatETA(mission.eta) : "DONE"}</span>
    </div>
  `;
}

function render() {
  const activeMissions = missions.filter((m) => m.status === "ACTIVE");
  const completeMissions = missions.filter((m) => m.status === "COMPLETE");

  return `
    <div class="missions-monitor">
      <div class="missions-header">ACTIVE OPERATIONS</div>
      <div class="missions-divider"></div>
      
      <div class="missions-summary">
        <span>Total: ${missions.length}</span>
        <span>Active: ${activeMissions.length}</span>
        <span>Complete: ${completeMissions.length}</span>
      </div>
      
      <div class="missions-divider"></div>
      
      <div class="missions-list">
        ${missions.length > 0 ? missions.map(renderMission).join("") : '<div class="missions-empty">No operations</div>'}
      </div>
    </div>
  `;
}

// =====================
// UPDATE
// =====================

function update() {
  missions.forEach((mission) => {
    if (mission.status === "ACTIVE") {
      // Progress increases
      mission.progress = Math.min(100, mission.progress + Math.random() * 5);

      // ETA decreases
      mission.eta = Math.max(0, mission.eta - 1);

      // Complete when progress reaches 100
      if (mission.progress >= 100) {
        mission.status = "COMPLETE";
      }
    }
  });

  // Add new mission randomly
  if (Math.random() < 0.02 && missions.length < 10) {
    missions.push(createMission());
  }

  // Remove old completed missions
  if (missions.length > 8) {
    const completeIndex = missions.findIndex((m) => m.status === "COMPLETE");
    if (completeIndex !== -1) {
      missions.splice(completeIndex, 1);
    }
  }
}

// =====================
// INIT
// =====================

function initialize() {
  // Start with 5 missions
  for (let i = 0; i < 5; i++) {
    missions.push(createMission());
  }
}

// =====================
// FUI WINDOW INSTANCE
// =====================

export const missionsWindow = createFUIWindow({
  id: "main-missions",
  render,
  update,
  interval: 500,
  defaultMode: "default",
});

// =====================
// PUBLIC API
// =====================

export function startMainMissions() {
  if (missions.length === 0) initialize();
  missionsWindow.start();
  console.log("✅ Main Missions started");
}

export function stopMainMissions() {
  missionsWindow.stop();
  console.log("⏹️ Main Missions stopped");
}