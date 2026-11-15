// Small shared pieces: icons, ENSO's broken circle, photos, sheets and toasts.
import { t, digits } from "./i18n.js";

export const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

const I = (d, extra = "") => `<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" ${extra}>${d}</svg>`;
export const ICON = {
  home: I('<path d="M4 10.5 12 4l8 6.5V20H4z"/><path d="M10 20v-5h4v5"/>'),
  menu: I('<path d="M8 3v7a2 2 0 0 1-4 0V3M6 10v11M18 21V3c-2.2 1-3.5 3.6-3.5 7 0 1.6.8 2.6 2 3H18"/>'),
  gather: I('<circle cx="12" cy="12" r="3"/><circle cx="12" cy="4" r="1.6"/><circle cx="19" cy="15.5" r="1.6"/><circle cx="5" cy="15.5" r="1.6"/><path d="M6.5 7.5A8 8 0 0 0 4.2 13M17.5 7.5A8 8 0 0 1 19.8 13M8 20.2a8 8 0 0 0 8 0"/>'),
  user: I('<circle cx="12" cy="8" r="4"/><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6"/>'),
  crm: I('<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>'),
  bag: I('<path d="M5 8h14l-1 12H6z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/>'),
  grid: I('<rect x="4" y="4" width="6" height="6" rx="1.5"/><rect x="14" y="4" width="6" height="6" rx="1.5"/><rect x="4" y="14" width="6" height="6" rx="1.5"/><rect x="14" y="14" width="6" height="6" rx="1.5"/>'),
  plus: I('<path d="M12 5v14M5 12h14"/>'),
  minus: I('<path d="M5 12h14"/>'),
  close: I('<path d="M6 6l12 12M18 6 6 18"/>'),
  back: I('<path d="M15 5l-7 7 7 7"/>'),
  chev: I('<path d="M9 5l7 7-7 7"/>'),
  search: I('<circle cx="11" cy="11" r="6.5"/><path d="M20 20l-4-4"/>'),
  phone: I('<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a1 1 0 0 1-1 1A16 16 0 0 1 4 5a1 1 0 0 1 1-1z"/>'),
  pin: I('<path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/>'),
  insta: I('<rect x="3.5" y="3.5" width="17" height="17" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.2" cy="6.8" r=".6" fill="currentColor"/>'),
  heart: I('<path d="M12 20s-7.5-4.6-7.5-10.2A4.3 4.3 0 0 1 12 7.4a4.3 4.3 0 0 1 7.5 2.4C19.5 15.4 12 20 12 20z"/>'),
  heartFill: I('<path d="M12 20s-7.5-4.6-7.5-10.2A4.3 4.3 0 0 1 12 7.4a4.3 4.3 0 0 1 7.5 2.4C19.5 15.4 12 20 12 20z" fill="currentColor"/>'),
  check: I('<path d="M5 12.5l4.5 4.5L19 7.5"/>'),
  clock: I('<circle cx="12" cy="12" r="8"/><path d="M12 8v4l3 2"/>'),
  truck: I('<path d="M3 6h11v10H3zM14 10h4l3 3v3h-7"/><circle cx="7" cy="17.5" r="1.8"/><circle cx="17" cy="17.5" r="1.8"/>'),
  store: I('<path d="M4 9l1.5-5h13L20 9M4 9v11h16V9M4 9h16M9 20v-6h6v6"/>'),
  gift: I('<rect x="4" y="9" width="16" height="11" rx="1"/><path d="M3 9h18M12 9v11M12 9c-2-4-6-4-6-1.5S10 9 12 9c2 0 6-1 6-1.5S14 5 12 9z"/>'),
  send: I('<path d="M4 12l16-8-6 16-2.5-6.5z"/>'),
  globe: I('<circle cx="12" cy="12" r="8.5"/><path d="M3.5 12h17M12 3.5c2.5 2.6 3.5 5.5 3.5 8.5s-1 5.9-3.5 8.5c-2.5-2.6-3.5-5.5-3.5-8.5s1-5.9 3.5-8.5z"/>'),
  download: I('<path d="M12 4v11M7 10l5 5 5-5M5 20h14"/>'),
  trash: I('<path d="M5 7h14M10 7V5h4v2M7 7l1 13h8l1-13"/>'),
  spark: I('<path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M6 18l2.5-2.5M15.5 8.5 18 6"/>'),
  users: I('<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20c1-3.6 3.6-5.5 6.5-5.5s5.5 1.9 6.5 5.5"/><path d="M15.5 4.8a3.5 3.5 0 0 1 0 6.4M18 14.8c1.8.8 3 2.6 3.5 5.2"/>'),
  note: I('<path d="M6 3h9l4 4v14H6z"/><path d="M14 3v5h5M9 12h7M9 16h5"/>'),
  cal: I('<rect x="4" y="5" width="16" height="15" rx="2"/><path d="M4 10h16M9 3v4M15 3v4"/>'),
};

// ENSO's broken circle: three arcs, cut 12° wide at 90°, 210° and 330°.
// `fill` (0–3) draws that many arcs in the live colour — their circle doubles as
// the order's progress ring.
export function ring({ size = 24, w = 0.23, fill = -1, cls = "", spin = false } = {}) {
  const r = 50 - (w * 50) / 2 - 1, sw = w * 50, c = 50;
  const arcs = [[96, 204], [216, 324], [336, 444]].map(([a, b], i) => {
    const p = (deg) => [c + r * Math.cos(deg * Math.PI / 180), c + r * Math.sin(deg * Math.PI / 180)];
    const [x0, y0] = p(a), [x1, y1] = p(b);
    const on = fill < 0 ? "" : i < fill ? " on" : " off";
    return `<path class="arc${on}" style="--i:${i}" d="M${x0.toFixed(2)} ${y0.toFixed(2)}A${r} ${r} 0 0 1 ${x1.toFixed(2)} ${y1.toFixed(2)}" pathLength="1"/>`;
  }).join("");
  return `<svg class="ring ${cls}${spin ? " spin" : ""}" viewBox="0 0 100 100" width="${size}" height="${size}" fill="none" stroke="currentColor" stroke-width="${sw.toFixed(1)}" aria-hidden="true">${arcs}</svg>`;
}

export const WORD = () => `<img class="word" src="assets/brand/enso-word.svg" alt="ENSO" width="92" height="25">`;

// a photo crop: the frame clips, the image is zoomed toward a point of interest
export function photo(img, cls = "", sm = true, alt = "") {
  if (!img) return `<span class="ph ph-empty ${cls}">${ring({ size: 28 })}</span>`;
  const z = img.zoom || 1;
  return `<span class="ph ${cls}"><img loading="lazy" decoding="async" alt="${esc(alt)}" src="assets/photos/${img.src}${sm ? "-sm" : ""}.webp" style="object-position:${img.pos};transform-origin:${img.pos};transform:scale(${z})"></span>`;
}

export const label = (s) => `<p class="cap">${s}</p>`;

// ---- sheets ----
let sheetN = 0;
export function sheet(html, { cls = "", onClose, mount } = {}) {
  const root = document.getElementById("sheet-root");
  const el = document.createElement("div");
  el.className = "sheet-wrap";
  el.innerHTML = `<div class="scrim" data-x></div><section class="sheet ${cls}" role="dialog" aria-modal="true"><span class="grab" aria-hidden="true"></span><button class="sheet-x" data-x aria-label="${t("Close")}">${ICON.close}</button><div class="sheet-body">${html}</div></section>`;
  root.appendChild(el);
  document.documentElement.classList.add("has-sheet");
  const id = ++sheetN;
  let cleanup;
  const close = () => {
    if (!el.isConnected || el.classList.contains("out")) return;
    el.classList.add("out");
    setTimeout(() => { el.remove(); if (!root.children.length) document.documentElement.classList.remove("has-sheet"); }, 320);
    onClose && onClose();
    typeof cleanup === "function" && cleanup();
  };
  el.addEventListener("click", (e) => { if (e.target.closest("[data-x]")) close(); });
  // drag the grab handle down to dismiss
  const sh = el.querySelector(".sheet");
  let y0 = null, dy = 0;
  sh.addEventListener("pointerdown", (e) => {
    if (!e.target.closest(".grab") && !(sh.querySelector(".sheet-body").scrollTop <= 0 && e.target.closest(".sheet-hero"))) return;
    y0 = e.clientY; sh.style.transition = "none"; sh.setPointerCapture(e.pointerId);
  });
  sh.addEventListener("pointermove", (e) => { if (y0 == null) return; dy = Math.max(0, e.clientY - y0); sh.style.transform = `translateY(${dy}px)`; });
  const end = () => { if (y0 == null) return; sh.style.transition = ""; sh.style.transform = ""; if (dy > 110) close(); y0 = null; dy = 0; };
  sh.addEventListener("pointerup", end); sh.addEventListener("pointercancel", end);
  requestAnimationFrame(() => el.classList.add("in"));
  cleanup = mount && mount(el.querySelector(".sheet-body"), close, id);
  return close;
}
export const closeSheets = () => document.querySelectorAll(".sheet-wrap").forEach((w) => w.querySelector(".scrim").click());

export function toast(msg) {
  const root = document.getElementById("toast-root");
  const el = document.createElement("div");
  el.className = "toast"; el.innerHTML = `${ring({ size: 16 })}<span>${msg}</span>`;
  root.appendChild(el);
  requestAnimationFrame(() => el.classList.add("in"));
  setTimeout(() => { el.classList.remove("in"); setTimeout(() => el.remove(), 400); }, 2200);
}

export const stepper = (val, act, id, min = 0) =>
  `<span class="stepper"><button type="button" data-act="${act}" data-id="${id}" data-d="-1" aria-label="${t("Less")}" ${val <= min ? "disabled" : ""}>${ICON.minus}</button><b>${digits(val)}</b><button type="button" data-act="${act}" data-id="${id}" data-d="1" aria-label="${t("More")}">${ICON.plus}</button></span>`;
