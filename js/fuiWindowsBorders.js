// document.querySelectorAll(".fui-window").forEach((win) => {
//   if (win.querySelector(".fui-border")) return;

//   const title = win.getAttribute("data-title") || "";

//   const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
//   svg.classList.add("fui-border");
//   svg.setAttribute("viewBox", "0 0 100 100");
//   svg.setAttribute("preserveAspectRatio", "none");

//   svg.innerHTML = `
//     <!-- border -->
//     <path d="
//       M 2 2 H 45
//       M 55 2 H 98
//       V 98 H 2 Z
//     " fill="none" stroke="var(--color-border)" stroke-width="0.8"/>

//     <!-- title -->
//     ${
//       title
//         ? `<text x="50" y="4" text-anchor="middle" class="fui-title">${title}</text>`
//         : ""
//     }
//   `;

//   win.prepend(svg);
// });
