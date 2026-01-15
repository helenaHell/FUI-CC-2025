// controller.js

import { renderIRCTwitter } from "./ircTwitter.js";
import { startIRCStats, stopIRCStats } from "./ircStats.js";
import { renderIRCFiles } from "./ircFiles.js";
import { renderIRCInterfaceStatus } from "./ircInterfaceStatus.js";

const ircTimers = {};

const IRC_TASKS = {
  files: {
    interval: 4000,
    render: renderIRCFiles,
  },

  interfaceStatus: {
    interval: 3000,
    render: renderIRCInterfaceStatus,
    mode: "scroll",
  },
};

document.addEventListener("tabChanged", (e) => {
  const tab = e.detail;

  if (tab === "4irc") {
    startIRC();
    startIRCStats();
  } else {
    stopIRC();
    stopIRCStats();
  }
});

function startIRC() {
  renderIRCTwitter();

  Object.entries(IRC_TASKS).forEach(([key, task]) => {
    if (ircTimers[key]) return;

    task.render();
    ircTimers[key] = setInterval(task.render, task.interval);
  });
}

function stopIRC() {
  Object.values(ircTimers).forEach(clearInterval);
  Object.keys(ircTimers).forEach((k) => delete ircTimers[k]);
}

const currentTab = document.querySelector("[data-tab].active");
if (currentTab && currentTab.dataset.tab === "4irc") {
  // Petit délai pour s'assurer que le DOM est prêt
  setTimeout(startDIST, 100);
}
