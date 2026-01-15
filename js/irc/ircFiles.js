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

const openFolders = new Set();
let selectedIndex = 0;
let flatList = [];

function renderHeader() {
  return `
    <div class="fb-header">
      <span class="fb-h-n">^n</span>
      <span class="fb-h-name">Name</span>
      <span class="fb-h-size">Size</span>
      <span class="fb-h-modify">Modify</span>
    </div>
  `;
}

function renderRow(name, data, depth, index) {
  const hasChildren = Object.keys(data.children).length > 0;
  const isOpen = openFolders.has(name);
  const icon = hasChildren ? (isOpen ? "/ ▼" : "/.") : "/..";
  const indent = depth * 16;
  const isSelected = index === selectedIndex;

  return `
      <div class="fb-row ${
        isSelected ? "selected" : ""
      }" data-folder="${name}" data-index="${index}">
        <span class="fb-n"></span>
        <span class="fb-name" style="padding-left:${
          6 + indent
        }px">${icon} ${name}</span>
        <span class="fb-size">${data.size}</span>
        <span class="fb-modify">${data.modify}</span>
      </div>
    `;
}

function buildFlatList(tree, depth = 0, list = []) {
  Object.entries(tree).forEach(([name, data]) => {
    list.push({ name, data, depth });
    if (openFolders.has(name)) {
      buildFlatList(data.children, depth + 1, list);
    }
  });
  return list;
}

function renderRows() {
  flatList = buildFlatList(FILE_SYSTEM);
  let html = "";
  flatList.forEach((item, index) => {
    html += renderRow(item.name, item.data, item.depth, index);
  });
  return html;
}

function renderBody() {
  return `
    <div class="fb-body">
      <div class="fb-body-separators">
        <span></span>
        <span></span>
        <span class="fb-sep-line"></span>
        <span class="fb-sep-line"></span>
      </div>
      ${renderRows()}
    </div>
  `;
}

function renderFooter() {
  return `
    <div class="fb-footer">
      <div class="fb-line"></div>
      <div class="fb-footer-row">
        <span>Up -- Dir</span>
      </div>
      <div class="fb-line-data">
        <span class="fb-line short"></span>
        <span>12.5/60GB (20I)</span>
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

function scrollToSelected() {
  const body = document.querySelector("#irc-files .fb-body");
  const selectedRow = document.querySelector("#irc-files .fb-row.selected");

  if (body && selectedRow) {
    const bodyRect = body.getBoundingClientRect();
    const rowRect = selectedRow.getBoundingClientRect();

    if (rowRect.top < bodyRect.top) {
      selectedRow.scrollIntoView({ block: "start", behavior: "smooth" });
    } else if (rowRect.bottom > bodyRect.bottom) {
      selectedRow.scrollIntoView({ block: "end", behavior: "smooth" });
    }
  }
}

function handleKeyboard(e) {
  const el = document.getElementById("irc-files");
  if (!el || !el.closest(".fui-window.locked")) return;

  const maxIndex = flatList.length - 1;

  if (e.key === "ArrowDown") {
    e.preventDefault();
    selectedIndex = Math.min(selectedIndex + 1, maxIndex);
    renderIRCFiles(true);
    scrollToSelected();
  } else if (e.key === "ArrowUp") {
    e.preventDefault();
    selectedIndex = Math.max(selectedIndex - 1, 0);
    renderIRCFiles(true);
    scrollToSelected();
  } else if (e.key === "Enter") {
    e.preventDefault();
    const selected = flatList[selectedIndex];
    if (selected) {
      const hasChildren = Object.keys(selected.data.children).length > 0;
      if (hasChildren) {
        if (openFolders.has(selected.name)) {
          openFolders.delete(selected.name);
        } else {
          openFolders.add(selected.name);
        }
        renderIRCFiles(true);
      }
    }
  }
}

function attachEvents() {
  document.querySelectorAll("#irc-files .fb-row").forEach((row) => {
    row.addEventListener("click", (e) => {
      e.stopPropagation();
      const index = parseInt(row.dataset.index);
      const name = row.dataset.folder;

      selectedIndex = index;

      if (name) {
        const selected = flatList[index];
        const hasChildren = Object.keys(selected.data.children).length > 0;

        if (hasChildren) {
          if (openFolders.has(name)) {
            openFolders.delete(name);
          } else {
            openFolders.add(name);
          }
        }
        renderIRCFiles(true);
      }
    });
  });
}

export function renderIRCFiles(preserveScroll = false) {
  const el = document.getElementById("irc-files");
  if (!el) return;

  const body = el.querySelector(".fb-body");
  const scrollPos = body ? body.scrollTop : 0;

  el.innerHTML = render();
  attachEvents();

  if (preserveScroll && body) {
    const newBody = el.querySelector(".fb-body");
    if (newBody) {
      newBody.scrollTop = scrollPos;
    }
  }
}

// Attach keyboard listener
document.addEventListener("keydown", handleKeyboard);

renderIRCFiles();
