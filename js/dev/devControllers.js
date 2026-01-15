console.log("🎮 DEV Controllers loaded");

import { startDevTerminal, stopDevTerminal } from "./devTerminal.js";
import { startDevLogs, stopDevLogs } from "./devLogs.js";
import { startDevEditor, stopDevEditor } from "./devEditor.js";
import { startDevFiles, stopDevFiles } from "./devFiles.js";

// =====================
// START/STOP
// =====================

function startDEV() {
  console.log("🚀 Starting DEV tab");
  
  startDevTerminal();
  startDevLogs();
  startDevEditor();
  startDevFiles();
}

function stopDEV() {
  console.log("⏹️ Stopping DEV tab");
  
  stopDevTerminal();
  stopDevLogs();
  stopDevEditor();
  stopDevFiles();
}

// =====================
// TAB CHANGE HANDLER
// =====================

document.addEventListener("tabChanged", (e) => {
  const tab = e.detail;

  if (tab === "6dev") {
    startDEV();
  } else {
    stopDEV();
  }
});

// =====================
// INITIAL LOAD
// =====================

const currentTab = document.querySelector("[data-tab].active");
if (currentTab && currentTab.dataset.tab === "6dev") {
  setTimeout(startDEV, 100);
}