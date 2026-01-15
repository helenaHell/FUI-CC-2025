let layoutEditMode = false;
let layoutState = {};
let activeWindowId = null; // Fenêtre actuellement active (= locked automatiquement)


const windowOrder = [
  // MAIN
  "main-system",
  "main-network",
  "main-missions",
  "main-log",
  "main-terminal",
  "main-globe",
  // WIN
  "win-users",
  "win-chat",
  "win-log",
  "win-stats",
  "win-files",
  "win-extra",
  // DIST
  "dist-mail",
  "dist-docs",
  "dist-files",
  "dist-addresses",
  // IRC
  "irc-chat",
  "irc-stats",
  "irc-files",
  "irc-twitter",
  "irc-InterfaceStatus",
  // DEV
  "dev-editor",
  "dev-logs",
  "dev-files",
  "dev-mail",
  // DOCS
  "docs-browser",
  "docs-viewer",
  // SEARCH
  "search-input",
  "search-results",
  // SYS
  "sys-stats",
  "sys-files",
];

/* ===============================
   GRID CONFIG
   =============================== */

const GRID_COLS = 3;
const GRID_ROWS = 2;

/* ===============================
   LAYOUTS
   =============================== */

const layouts = {
  /* ===============================
     MAIN
     =============================== */
  "1main": {
    "main-system":   { col: 1, row: 1, w: 1, h: 1 },
    "main-network":  { col: 2, row: 1, w: 1, h: 1 },
    "main-missions": { col: 3, row: 1, w: 1, h: 1 },

    "main-log":      { col: 1, row: 2, w: 1, h: 1 },
    "main-terminal": { col: 2, row: 2, w: 1, h: 1 },
    "main-globe":    { col: 3, row: 2, w: 1, h: 1 },
  },

  /* ===============================
     DOCS
     =============================== */
  "2docs": {
    "docs-browser": { col: 1, row: 1, w: 2, h: 2 },
    "docs-viewer":  { col: 3, row: 1, w: 1, h: 2 },
  },

  /* ===============================
     DIST
     =============================== */
  "3dist": {
    "dist-addresses": { col: 1, row: 1, w: 1, h: 2 },
    "dist-mail":      { col: 2, row: 1, w: 1, h: 2 },
    "dist-docs":      { col: 3, row: 1, w: 1, h: 1 },
    "dist-files":     { col: 3, row: 2, w: 1, h: 1 },
  },

  /* ===============================
     IRC
     =============================== */
  "4irc": {
    "irc-files":            { col: 1, row: 1, w: 1, h: 1 },
    "irc-chat":             { col: 2, row: 1, w: 1, h: 1 },
    "irc-twitter":          { col: 3, row: 1, w: 1, h: 1 },

    "irc-stats":            { col: 1, row: 2, w: 1, h: 1 },
    "irc-InterfaceStatus":  { col: 2, row: 2, w: 2, h: 1 },
  },

  /* ===============================
     SEARCH
     =============================== */
  "5search": {
    "search-input":   { col: 1, row: 1, w: 3, h: 1 },
    "search-results": { col: 1, row: 2, w: 3, h: 1 },
  },

  /* ===============================
     DEV
     =============================== */
  "6dev": {
    "dev-editor": { col: 1, row: 1, w: 2, h: 2 },
    "dev-logs":   { col: 3, row: 1, w: 1, h: 1 },
    "dev-files":  { col: 3, row: 2, w: 1, h: 1 },
  },

  /* ===============================
     MISC / WINDOWS
     =============================== */
  "7misc": {
    "win-users": { col: 1, row: 1, w: 1, h: 1 },
    "win-chat":  { col: 2, row: 1, w: 1, h: 1 },
    "win-log":   { col: 3, row: 1, w: 1, h: 1 },

    "win-stats": { col: 1, row: 2, w: 1, h: 1 },
    "win-files": { col: 2, row: 2, w: 1, h: 1 },
    "win-extra": { col: 3, row: 2, w: 1, h: 1 },
  },
};

/* ===============================
   RENDER LAYOUT
   =============================== */

function renderLayout() {
  Object.entries(layoutState).forEach(([id, pos]) => {
    const el = document.getElementById(id);
    if (!el) return;

    // Apply grid position
    el.style.gridColumn = `${pos.col} / span ${pos.w}`;
    el.style.gridRow = `${pos.row} / span ${pos.h}`;

    // Active window = locked (orange border)
    el.classList.toggle("locked", id === activeWindowId);
    
    // Edit mode styling
    el.classList.toggle("active", id === activeWindowId && layoutEditMode);
  });
}

/* ===============================
   RESIZE WINDOW (PUBLIC API)
   =============================== */

function resizeWindow(id, w, h) {
  if (!layoutState[id]) return false;

  layoutState[id].w = w;
  layoutState[id].h = h;

  renderLayout();
  return true;
}

// Export for external use (devMail.js, etc.)
window.resizeWindow = resizeWindow;

/* ===============================
   LOAD LAYOUT
   =============================== */

function loadLayout(name) {
  const preset = layouts[name];
  if (!preset) return;

  // Load layout
  layoutState = JSON.parse(JSON.stringify(preset));

  // Set first window as active
  activeWindowId = Object.keys(layoutState)[0];

  // Show/hide windows
  windowOrder.forEach((id) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.style.display = layoutState[id] ? "block" : "none";
  });

  renderLayout();

  // Notify other systems
  document.dispatchEvent(new CustomEvent("tabChanged", { detail: name }));
}

/* ===============================
   GLOBAL EVENT BLOCKER (when window is locked)
   =============================== */

document.addEventListener("keydown", (e) => {
  if (!activeWindowId) return;
  
  // Trouver si l'événement vient d'une fenêtre FUI
  const targetWindow = e.target.closest('.fui-window');
  
  // Si oui, et que ce n'est PAS la fenêtre active → BLOQUER
  if (targetWindow && targetWindow.id !== activeWindowId) {
    e.stopPropagation();
    e.preventDefault();
  }
}, true);

/* ===============================
   WINDOW NAVIGATION (Alt + Arrows)
   =============================== */

function getWindowList() {
  // Retourne la liste des fenêtres dans l'ordre du layout actuel
  return Object.keys(layoutState);
}

function getNextWindow(direction) {
  const windows = getWindowList();
  const currentIndex = windows.indexOf(activeWindowId);
  
  if (currentIndex === -1) return windows[0];
  
  let nextIndex;
  
  switch (direction) {
    case "right":
    case "down":
      // Suivant (avec wrap)
      nextIndex = (currentIndex + 1) % windows.length;
      break;
    case "left":
    case "up":
      // Précédent (avec wrap)
      nextIndex = (currentIndex - 1 + windows.length) % windows.length;
      break;
    default:
      return activeWindowId;
  }
  
  return windows[nextIndex];
}

/* ===============================
   KEYBOARD: NAVIGATION (Alt + Arrows)
   =============================== */

document.addEventListener("keydown", (e) => {
  // Alt + Arrow = Navigate between windows
  if (e.altKey && e.code.startsWith("Arrow")) {
    e.preventDefault();

    if (activeWindowId) {
      const previousWindow = document.getElementById(activeWindowId);
      if (previousWindow) {
        const focused = previousWindow.querySelector(':focus');
        if (focused) {
          focused.blur();
        }
      }
    }

    if (!activeWindowId) {
      const windows = getWindowList();
      activeWindowId = windows[0];
    } else {
      const direction = e.code.replace("Arrow", "").toLowerCase();
      activeWindowId = getNextWindow(direction);
    }

    renderLayout();
    
    // ✅ AUTO-FOCUS sur textarea/input si présent dans la fenêtre active
    setTimeout(() => {
      const activeWindow = document.getElementById(activeWindowId);
      if (activeWindow) {
        const focusable = activeWindow.querySelector('textarea, input[type="text"]');
        if (focusable) {
          focusable.focus();

        }
      }
    }, 50);
    
  }
});

/* ===============================
   KEYBOARD: EDIT MODE (Cmd)
   =============================== */

document.addEventListener("keydown", (e) => {
  // Cmd = Toggle edit mode
  if (e.code === "MetaLeft" || e.code === "MetaRight") {
    e.preventDefault();
    layoutEditMode = !layoutEditMode;
    document.body.classList.toggle("layout-edit", layoutEditMode);

    renderLayout();
  }
});

/* ===============================
   KEYBOARD: RESIZE/MOVE (when in Edit Mode)
   =============================== */

document.addEventListener("keydown", (e) => {
  if (!layoutEditMode || !activeWindowId) return;

  const win = layoutState[activeWindowId];
  if (!win) return;

  let changed = false;

  // SHIFT + Arrows = Resize
  if (e.shiftKey) {
    switch (e.code) {
      case "ArrowRight":
        if (win.col + win.w <= GRID_COLS) {
          win.w += 1;
          changed = true;
        }
        break;
      case "ArrowDown":
        if (win.row + win.h <= GRID_ROWS) {
          win.h += 1;
          changed = true;
        }
        break;
      case "ArrowLeft":
        if (win.w > 1) {
          win.w -= 1;
          changed = true;
        }
        break;
      case "ArrowUp":
        if (win.h > 1) {
          win.h -= 1;
          changed = true;
        }
        break;
    }
  }
  // Arrows (no Shift) = Move
  else if (!e.altKey) {
    // Ignore if Alt is pressed (navigation)
    switch (e.code) {
      case "ArrowUp":
        if (win.row > 1) {
          win.row -= 1;
          changed = true;
        }
        break;
      case "ArrowDown":
        if (win.row + win.h <= GRID_ROWS) {
          win.row += 1;
          changed = true;
        }
        break;
      case "ArrowLeft":
        if (win.col > 1) {
          win.col -= 1;
          changed = true;
        }
        break;
      case "ArrowRight":
        if (win.col + win.w <= GRID_COLS) {
          win.col += 1;
          changed = true;
        }
        break;
    }
  }

  if (changed) {
    e.preventDefault();
    renderLayout();
  }
});

/* ===============================
   INIT
   =============================== */

loadLayout("1main");