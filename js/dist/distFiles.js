console.log("DIST-FILES loaded");
import { createFUIWindow } from "../core/template.js";

// =====================
// FILE SYSTEM DATA
// =====================

const FILE_SYSTEM = {
  "": {
    size: "Up-Dir",
    modify: "",
    children: {},
  },
  archive: {
    size: 24576,
    modify: "16:43",
    children: {
      2019: {
        size: 12288,
        modify: "14:22",
        children: {
          jan: { size: 2048, modify: "09:12", children: {} },
          feb: { size: 3072, modify: "10:44", children: {} },
        },
      },
      2020: {
        size: 18432,
        modify: "15:11",
        children: {
          mar: { size: 4096, modify: "11:03", children: {} },
          apr: { size: 5120, modify: "12:50", children: {} },
        },
      },
    },
  },
  assets: {
    size: 4096,
    modify: "14:23",
    children: {
      images: {
        size: 2048,
        modify: "11:22",
        children: {
          ui: { size: 512, modify: "09:21", children: {} },
          icons: { size: 384, modify: "08:55", children: {} },
        },
      },
      videos: {
        size: 8192,
        modify: "16:44",
        children: {
          promo: { size: 4096, modify: "13:11", children: {} },
          raw: { size: 12288, modify: "18:01", children: {} },
        },
      },
    },
  },
  boot: {
    size: 28488,
    modify: "13:52",
    children: {
      grub: {
        size: 512,
        modify: "10:11",
        children: {
          cfg: { size: 128, modify: "10:10", children: {} },
        },
      },
      initrd: {
        size: 24576,
        modify: "13:52",
        children: {},
      },
    },
  },
  "cgi-ssh": {
    size: 1582,
    modify: "02:21",
    children: {
      bin: {
        size: 256,
        modify: "02:20",
        children: {
          connect: { size: 64, modify: "02:18", children: {} },
        },
      },
      config: {
        size: 1024,
        modify: "02:21",
        children: {},
      },
    },
  },
  database: {
    size: 3423,
    modify: "12:48",
    children: {
      users: {
        size: 890,
        modify: "15:32",
        children: {
          index: { size: 256, modify: "15:30", children: {} },
        },
      },
      logs: {
        size: 2048,
        modify: "18:22",
        children: {
          error: { size: 512, modify: "18:20", children: {} },
          access: { size: 768, modify: "18:21", children: {} },
        },
      },
    },
  },
  "disk-util": {
    size: 4098,
    modify: "19:21",
    children: {
      fsck: {
        size: 2048,
        modify: "19:21",
        children: {},
      },
      mount: {
        size: 1024,
        modify: "19:20",
        children: {},
      },
    },
  },
  info: {
    size: 1823,
    modify: "11:03",
    children: {
      readme: { size: 512, modify: "11:03", children: {} },
      license: { size: 1024, modify: "11:02", children: {} },
    },
  },
  ntpppd: {
    size: 2356,
    modify: "21:13",
    children: {
      conf: { size: 256, modify: "21:13", children: {} },
      drift: { size: 128, modify: "21:10", children: {} },
    },
  },
  security: {
    size: 7,
    modify: "10:08",
    children: {
      keys: {
        size: 512,
        modify: "10:08",
        children: {
          rsa: { size: 128, modify: "10:07", children: {} },
        },
      },
      certs: {
        size: 1024,
        modify: "10:07",
        children: {},
      },
    },
  },
  software_updt: {
    size: 32750,
    modify: "00:02",
    children: {
      patches: {
        size: 16384,
        modify: "00:02",
        children: {
          core: { size: 4096, modify: "00:01", children: {} },
        },
      },
      updates: {
        size: 8192,
        modify: "23:55",
        children: {},
      },
    },
  },
  startup: {
    size: 50,
    modify: "07:34",
    children: {
      "init.d": {
        size: 256,
        modify: "07:34",
        children: {
          net: { size: 64, modify: "07:30", children: {} },
        },
      },
    },
  },
  track_ip: {
    size: 1982,
    modify: "04:23",
    children: {
      logs: {
        size: 4096,
        modify: "04:23",
        children: {
          today: { size: 512, modify: "04:21", children: {} },
          yesterday: { size: 768, modify: "03:58", children: {} },
        },
      },
    },
  },
};

// =====================
// STATE
// =====================

const openFolders = new Set();

// =====================
// HELPERS
// =====================

function formatSize(bytes) {
  if (typeof bytes === "string") return bytes;
  if (bytes < 1024) return `${bytes}B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
}

function countChildren(children) {
  return Object.keys(children).length;
}

function countAllFolders(tree) {
  let count = 0;
  Object.values(tree).forEach((data) => {
    if (data.children && Object.keys(data.children).length > 0) {
      count++;
      count += countAllFolders(data.children);
    }
  });
  return count;
}

// =====================
// RENDER FUNCTIONS
// =====================

function renderHeader() {
  return `
    <div class="fb-header">
      <span class="fb-h-n">^</span>
      <span class="fb-h-name">Name</span>
      <span class="fb-h-size">Size</span>
      <span class="fb-h-modify">Modify</span>
    </div>
  `;
}

function renderRow(name, data, depth, path) {
  const hasChildren = Object.keys(data.children).length > 0;
  const isOpen = openFolders.has(path);
  const icon = hasChildren ? (isOpen ? "▼" : "▶") : "•";
  const indent = depth * 16;
  const childCount = hasChildren ? ` (${countChildren(data.children)})` : "";

  return `
    <div class="fb-row" data-path="${path}" data-has-children="${hasChildren}">
      <span class="fb-n">${icon}</span>
      <span class="fb-name" style="padding-left:${6 + indent}px">${name}${childCount}</span>
      <span class="fb-size">${formatSize(data.size)}</span>
      <span class="fb-modify">${data.modify}</span>
    </div>
  `;
}

function renderRows(tree, depth = 0, parentPath = "") {
  let html = "";
  Object.entries(tree).forEach(([name, data]) => {
    const path = parentPath ? `${parentPath}/${name}` : name;
    html += renderRow(name, data, depth, path);
    if (openFolders.has(path) && data.children) {
      html += renderRows(data.children, depth + 1, path);
    }
  });
  return html;
}

function renderBody() {
  return `
    <div class="fb-body">
      <div class="fb-body-separators">
        <span></span>
        <span class="fb-sep-line"></span>
        <span class="fb-sep-line"></span>
        <span class="fb-sep-line"></span>
      </div>
      ${renderRows(FILE_SYSTEM)}
    </div>
  `;
}

function renderFooter() {
  const totalOpen = openFolders.size;
  const totalFolders = countAllFolders(FILE_SYSTEM);
  
  return `
    <div class="fb-footer">
      <div class="fb-line"></div>
      <div class="fb-footer-row">
        <span>[/home/system/files]</span>
        <span>${totalOpen}/${totalFolders} open</span>
      </div>
      <div class="fb-line-data">
        <span class="fb-line short"></span>
        <span>12.5/60GB (20%)</span>
      </div>
    </div>
  `;
}

function render() {
  return `
    <div class="files-container">
      ${renderHeader()}
      ${renderBody()}
      ${renderFooter()}
    </div>
  `;
}

// =====================
// UPDATE & EVENTS
// =====================

function update() {
  // Ré-attacher les events après re-render
  setTimeout(attachEvents, 10);
}

function attachEvents() {
  document.querySelectorAll("#dist-files .fb-row").forEach((row) => {
    row.addEventListener("click", (e) => {
      e.stopPropagation();
      const path = row.dataset.path;
      const hasChildren = row.dataset.hasChildren === "true";

      if (!hasChildren) return; // Ignore files

      if (openFolders.has(path)) {
        openFolders.delete(path);
      } else {
        openFolders.add(path);
      }

      filesWindow.start(); // Force re-render
    });
  });
}

// =====================
// FUI WINDOW INSTANCE
// =====================

export const filesWindow = createFUIWindow({
  id: "dist-files",
  render,
  update,
  interval: null, // Pas d'interval, static content
  defaultMode: "default",
});

// =====================
// PUBLIC API
// =====================

export function startDISTFiles() {
  filesWindow.start();
  console.log("✅ DIST Files started");
}

export function stopDISTFiles() {
  filesWindow.stop();
  console.log("⏹️ DIST Files stopped");
}