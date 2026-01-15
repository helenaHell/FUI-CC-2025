// Debug script - à ajouter après layout-v2.js

console.log("Layout Debug Helper loaded");

// Affiche l'état actuel du layout
window.debugLayoutState = function () {
  const activeTab = document.querySelector("[data-tab].active")?.dataset.tab;
  console.log("=== CURRENT LAYOUT STATE ===");
  console.log("Active Tab:", activeTab);
  console.log("Layout Keys:", Object.keys(layoutState));
  console.log("Active Window ID:", activeWindowId);

  console.log("\nVisible Windows:");
  windowOrder.forEach((id) => {
    const el = document.getElementById(id);
    if (el && el.style.display !== "none") {
      const expected = layoutState[id] ? "VISIBLE" : "HIDDEN";
      console.log(`  ${id} (expected: ${expected})`);
    }
  });

  console.log("\nHidden Windows:");
  windowOrder.forEach((id) => {
    const el = document.getElementById(id);
    if (el && el.style.display === "none") {
      console.log(`  ${id}`);
    }
  });

  console.log("\nWindows visible but not in layout:");
  windowOrder.forEach((id) => {
    const el = document.getElementById(id);
    if (el && !layoutState[id] && el.style.display !== "none") {
      console.log(`  ${id} - should be hidden`);
    }
  });
};

// Vérification automatique après chaque loadLayout
const originalLoadLayout = window.loadLayout;
window.loadLayout = function (name) {
  originalLoadLayout(name);
  setTimeout(() => {
    console.log(`\nAfter loading layout "${name}":`);
    window.debugLayoutState();
  }, 100);
};

console.log("Use window.debugLayoutState() to inspect current layout state");
