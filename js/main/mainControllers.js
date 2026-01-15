console.log("🎮 MAIN Controllers loaded");

import { startMainSystem, stopMainSystem } from "./mainSystem.js";
import { startMainNetwork, stopMainNetwork } from "./mainNetwork.js";
import { startMainMissions, stopMainMissions } from "./mainMission.js";
import { startMainLog, stopMainLog } from "./mainLog.js";
import { startMainTerminal, stopMainTerminal } from "./mainTerminal.js";

// =====================
// START/STOP
// =====================

function startMAIN() {
  console.log("🚀 Starting MAIN tab");
  
  startMainSystem();
  startMainNetwork();
  startMainMissions();
  startMainLog();
  startMainTerminal();
}

function stopMAIN() {
  console.log("⏹️ Stopping MAIN tab");
  
  stopMainSystem();
  stopMainNetwork();
  stopMainMissions();
  stopMainLog();
  stopMainTerminal();
}

// =====================
// TAB CHANGE HANDLER
// =====================

document.addEventListener("tabChanged", (e) => {
  const tab = e.detail;

  if (tab === "1main") {
    startMAIN();
  } else {
    stopMAIN();
  }
});

// =====================
// INITIAL LOAD
// =====================

const currentTab = document.querySelector("[data-tab].active");
if (currentTab && currentTab.dataset.tab === "1main") {
  setTimeout(startMAIN, 100);
}