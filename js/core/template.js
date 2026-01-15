// ============================================
// FUI WINDOW TEMPLATE
// Purpose:
// - Safe mounting
// - Interval management
// - Mode switching (small / large / etc.)
// - Centralized lifecycle control
// ============================================

export function createFUIWindow(config) {
  const {
    id, // DOM id of the window (ex: "irc-stats")
    render, // function(mode) -> HTML string
    update = null, // optional update() called before render
    interval = null, // optional refresh rate (ms)
    defaultMode = "large",
  } = config;

  let timer = null;
  let currentMode = defaultMode;

  // --------------------------------------------
  // INTERNAL: get DOM element safely
  // --------------------------------------------
  function getEl() {
    return document.getElementById(id);
  }

  // --------------------------------------------
  // INTERNAL: single render tick
  // --------------------------------------------
  function tick() {
    const el = getEl();
    if (!el) return;

    if (update) update();
    el.innerHTML = render(currentMode);
  }

  // --------------------------------------------
  // PUBLIC: start window (called by controller)
  // --------------------------------------------
  function start() {
    stop(); // safety

    tick(); // immediate render

    if (interval) {
      timer = setInterval(tick, interval);
    }
  }

  // --------------------------------------------
  // PUBLIC: stop window (called by controller)
  // --------------------------------------------
  function stop() {
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
  }

  // --------------------------------------------
  // PUBLIC: change mode (called by layout)
  // --------------------------------------------
  function setMode(mode) {
    if (currentMode === mode) return;
    currentMode = mode;
    tick();
  }

  // --------------------------------------------
  // PUBLIC API
  // --------------------------------------------
  return {
    id,
    start,
    stop,
    setMode,
  };
}

// ============================================
// FUI INTERACTIONS TEMPLATE
// Scroll + Keyboard + Row Highlight (Persistent)
// ============================================

const fuiInteractionState = {};
const fuiStreamState = {};

/* ===============================
   INTERNAL HELPERS
=============================== */

function getInteractionState(windowId) {
  if (!fuiInteractionState[windowId]) {
    fuiInteractionState[windowId] = {
      scrollTop: 0,
      isUserScrolling: false,
      scrollTimeout: null,
      highlightedRows: new Set(),
      selectedIndex: null,
    };
  }
  return fuiInteractionState[windowId];
}

function getStreamState(streamId) {
  if (!fuiStreamState[streamId]) {
    fuiStreamState[streamId] = {
      rows: [],
      initialized: false,
    };
  }
  return fuiStreamState[streamId];
}

/* ===============================
   SCROLL + ROW INTERACTIONS
=============================== */

export function setupFUIInteractions({
  windowId,
  scrollContainerSelector,
  rowSelector,
  autoScroll = "top", // "top" | "none"
  keyboardScrollStep = 24,
}) {
  const root = document.getElementById(windowId);
  if (!root) return;

  const container = root.querySelector(scrollContainerSelector);
  if (!container) return;

  const state = getInteractionState(windowId);

  container.style.overflowY = "auto";
  container.tabIndex = 0;
  container.scrollTop = state.scrollTop;

  /* -----------------------------
     USER SCROLL DETECTION
  ----------------------------- */
  container.addEventListener("scroll", () => {
    state.isUserScrolling = true;
    state.scrollTop = container.scrollTop;

    if (state.scrollTimeout) {
      clearTimeout(state.scrollTimeout);
    }

    if (container.scrollTop === 0) {
      state.isUserScrolling = false;
    } else {
      state.scrollTimeout = setTimeout(() => {
        state.isUserScrolling = false;
        if (autoScroll === "top") {
          container.scrollTop = 0;
        }
      }, 5000);
    }
  });

  /* -----------------------------
     KEYBOARD SCROLL
  ----------------------------- */
  container.addEventListener("keydown", (e) => {
    if (e.code === "ArrowDown") {
      container.scrollTop += keyboardScrollStep;
      state.scrollTop = container.scrollTop;
      e.preventDefault();
    }

    if (e.code === "ArrowUp") {
      container.scrollTop -= keyboardScrollStep;
      state.scrollTop = container.scrollTop;
      e.preventDefault();
    }
  });

  /* -----------------------------
     ROW CLICK → HIGHLIGHT
  ----------------------------- */
  if (!rowSelector) return;

  const rows = root.querySelectorAll(rowSelector);

  rows.forEach((row, index) => {
    if (state.highlightedRows.has(index)) {
      row.classList.add("fui-row-highlight");
    }

    row.addEventListener("click", () => {
      if (state.highlightedRows.has(index)) {
        state.highlightedRows.delete(index);
        row.classList.remove("fui-row-highlight");
      } else {
        state.highlightedRows.add(index);
        row.classList.add("fui-row-highlight");
      }
      state.selectedIndex = index;
    });
  });
}

/* ===============================
   STREAM (TWITTER-LIKE)
=============================== */

export function createFUIStream({
  streamId,
  createRow,
  initialSize = 20,
  maxSize = 50,
}) {
  const state = getStreamState(streamId);

  // Generate ONCE
  if (!state.initialized) {
    for (let i = 0; i < initialSize; i++) {
      state.rows.push(createRow());
    }
    state.initialized = true;
  }

  function pushRow() {
    state.rows.unshift(createRow());
    if (state.rows.length > maxSize) {
      state.rows.pop();
    }
  }

  function getRows() {
    return state.rows;
  }

  return {
    pushRow,
    getRows,
  };
}

/* ===============================
   OPTIONAL API
=============================== */

export function clearFUIHighlights(windowId) {
  if (fuiInteractionState[windowId]) {
    fuiInteractionState[windowId].highlightedRows.clear();
    fuiInteractionState[windowId].selectedIndex = null;
  }
}

/* ===============================
   CSS (ONCE)
=============================== */

(function injectFUIStyle() {
  if (document.getElementById("fui-interactions-style")) return;

  const style = document.createElement("style");
  style.id = "fui-interactions-style";
  style.textContent = `
    .fui-row-highlight {
      background-color: rgba(0,255,0,0.12);
      outline: 1px solid rgba(0,255,0,0.35);
    }
  `;
  document.head.appendChild(style);
})();
