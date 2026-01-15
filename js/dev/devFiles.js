console.log("DEV-FILES loaded");
import { createFUIWindow } from "../core/template.js";

// =====================
// FILE STRUCTURE
// =====================

const FILE_TREE = {
  "": { type: "up", size: "Up-Dir" },
  "leaks/": {
    type: "dir",
    size: "4.2GB",
    children: {
      "prism/": { type: "dir", size: "1.8GB" },
      "vault7/": { type: "dir", size: "2.1GB" },
      "cables/": { type: "dir", size: "340MB" },
    },
  },
  "tools/": {
    type: "dir",
    size: "120MB",
    children: {
      "analysis/": { type: "dir", size: "45MB" },
      "encryption/": { type: "dir", size: "38MB" },
      "scraping/": { type: "dir", size: "37MB" },
    },
  },
  "processed/": {
    type: "dir",
    size: "8.9GB",
    children: {
      "2024-01/": { type: "dir", size: "2.1GB" },
      "2024-02/": { type: "dir", size: "3.4GB" },
      "2024-03/": { type: "dir", size: "3.4GB" },
    },
  },
  "archive/": { type: "dir", size: "15.2GB" },
  "docs/": { type: "dir", size: "580MB" },
  "scripts/": { type: "dir", size: "24MB" },
};

const openFolders = new Set();

// =====================
// HELPERS
// =====================

function getIcon(item) {
  if (item.type === "up") return "↑";
  if (item.type === "dir") return openFolders.has(item.path) ? "▼" : "▶";
  return "•";
}

// =====================
// RENDER
// =====================

function renderItem(name, item, depth = 0, path = "") {
  const icon = getIcon({ ...item, path });
  const indent = "  ".repeat(depth);
  const hasChildren = item.children && Object.keys(item.children).length > 0;

  let html = `
    <div class="file-row" data-path="${path}" data-has-children="${hasChildren}">
      <span class="file-icon">${icon}</span>
      <span class="file-name">${indent}${name}</span>
      <span class="file-size">${item.size}</span>
    </div>
  `;

  // Render children if folder is open
  if (hasChildren && openFolders.has(path)) {
    Object.entries(item.children).forEach(([childName, childItem]) => {
      const childPath = path ? `${path}/${childName}` : childName;
      html += renderItem(childName, childItem, depth + 1, childPath);
    });
  }

  return html;
}

function render() {
  return `
    <div class="dev-files">
      <div class="files-header">/home/wikileaks/data</div>
      <div class="files-separator">─────────────────────────</div>
      <div class="files-list">
        ${Object.entries(FILE_TREE)
          .map(([name, item]) => renderItem(name, item, 0, name))
          .join("")}
      </div>
      <div class="files-footer">
        <span>${Object.keys(FILE_TREE).length - 1} items</span>
        <span>28.9GB total</span>
      </div>
    </div>
  `;
}

// =====================
// UPDATE & EVENTS
// =====================

function update() {
  setTimeout(attachEvents, 10);
}

function attachEvents() {
  document.querySelectorAll("#dev-files .file-row").forEach((row) => {
    row.addEventListener("click", (e) => {
      e.stopPropagation();
      const path = row.dataset.path;
      const hasChildren = row.dataset.hasChildren === "true";

      if (!hasChildren) return;

      if (openFolders.has(path)) {
        openFolders.delete(path);
      } else {
        openFolders.add(path);
      }

      devFilesWindow.start(); // Force re-render
    });
  });
}

// =====================
// FUI WINDOW INSTANCE
// =====================

export const devFilesWindow = createFUIWindow({
  id: "dev-files",
  render,
  update,
  interval: null, // Static, only events
  defaultMode: "default",
});

// =====================
// PUBLIC API
// =====================

export function startDevFiles() {
  devFilesWindow.start();
  console.log("✅ Dev Files started");
}

export function stopDevFiles() {
  devFilesWindow.stop();
  console.log("⏹️ Dev Files stopped");
}