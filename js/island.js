// The island: one black pill at the foot of the screen. It names the page you're
// on and carries the bag; while an order is being made it becomes a live activity
// — ENSO's broken circle filling arc by arc; tapped, it opens into a panel of
// every place in the app. Scrolling down folds it to its dot and the bag.
import { t, lang, setLang, money, digits } from "./i18n.js";
import { ICON, ring } from "./ui.js";
import { bagCount, bagTotal, liveOrder } from "./store.js";
import { openBag } from "./views/bag.js";

const PLACES = [
  ["home", "#/", "home", "Home"],
  ["menu", "#/menu", "menu", "Menu"],
  ["gather", "#/gather", "gather", "Gatherings"],
  ["profile", "#/profile", "user", "Profile"],
  ["crm", "#/crm", "crm", "CRM"],
];
let el, current = "home", open = false, bound = false;

// called again on every language switch: rebuild the markup, but wire the
// listeners only once — a second set made every tap open and close at once
export function mountIsland() {
  el = document.getElementById("island");
  el.innerHTML = `
  <div class="isl-scrim" data-close></div>
  <div class="isl-panel" role="dialog" aria-label="${t("Go to")}" id="isl-panel">
    <div class="isl-tiles" id="isl-tiles"></div>
    <button class="isl-cta" type="button" id="isl-cta"></button>
  </div>
  <div class="isl-pill" id="isl-pill">
    <button class="isl-main" type="button" id="isl-main" aria-expanded="false" aria-controls="isl-panel"></button>
    <span class="isl-div" aria-hidden="true"></span>
    <button class="isl-bag" type="button" id="isl-bag"></button>
  </div>`;
  if (open) { el.querySelector("#isl-main").setAttribute("aria-expanded", "true"); }
  update();
  if (bound) return;
  bound = true;
  el.addEventListener("click", (e) => {
    if (e.target.closest("#isl-main")) return toggle();
    if (e.target.closest("#isl-bag")) { toggle(false); return openBag(); }
    if (e.target.closest("[data-close]")) return toggle(false);
    const lg = e.target.closest("[data-lang]"); if (lg) { setLang(lang === "fa" ? "en" : "fa"); return; }
    if (e.target.closest("#isl-cta")) { toggle(false); if (bagCount()) openBag(); else location.hash = "#/menu"; return; }
    if (e.target.closest(".tile")) toggle(false);
  });
  addEventListener("keydown", (e) => { if (e.key === "Escape" && open) toggle(false); });
  // fold on the way down, open on the way up
  let last = scrollY, acc = 0;
  addEventListener("scroll", () => {
    const y = scrollY, dy = y - last; last = y;
    acc = Math.sign(dy) === Math.sign(acc) ? acc + dy : dy;
    if (open) return;
    if (y < 60 || acc < -24) el.classList.remove("folded");
    else if (acc > 36) el.classList.add("folded");
  }, { passive: true });
}

function toggle(v = !open) {
  open = v;
  el.classList.toggle("open", open);
  document.documentElement.classList.toggle("isl-open", open);
  el.querySelector("#isl-main").setAttribute("aria-expanded", open);
  if (open) {
    el.classList.remove("folded");
    const pill = el.querySelector("#isl-pill");
    el.style.setProperty("--pw", pill.offsetWidth + "px");
  }
}

export function setPlace(id) { current = id; update(); }

export function update() {
  if (!el) return;
  const live = liveOrder();
  const place = PLACES.find((p) => p[0] === current) || PLACES[0];
  const n = bagCount();
  const main = el.querySelector("#isl-main");
  const stageT = ["Received", "In the oven", "Ready"];
  if (live) {
    const mins = Math.max(1, Math.ceil((live.eta - Date.now()) / 60000));
    main.innerHTML = `<span class="isl-live">${ring({ size: 26, fill: live.stage + 1 })}</span><span class="isl-label two"><b>${t("Order")} ${digits(live.code)}</b><small>${t(stageT[live.stage])}${live.stage < 2 ? " · " + t("{m} min", { m: digits(mins) }) : ""}</small></span><span class="isl-grid">${ICON.grid}</span>`;
    el.classList.add("is-live"); el.classList.toggle("is-ready", live.stage === 2);
  } else {
    main.innerHTML = `<i class="isl-dot" aria-hidden="true"></i><span class="isl-label">${t(place[3])}</span><span class="isl-grid">${ICON.grid}</span>`;
    el.classList.remove("is-live", "is-ready");
  }
  main.setAttribute("aria-label", t("{p} — open navigation", { p: t(place[3]) }));
  const bag = el.querySelector("#isl-bag");
  const prev = bag.dataset.n;
  bag.innerHTML = n ? `${ICON.bag}<b>${digits(n)}</b>` : ICON.bag;
  bag.dataset.n = n; bag.classList.toggle("has", n > 0);
  bag.setAttribute("aria-label", n ? t("Bag, {n} items", { n: digits(n) }) : t("Bag, empty"));
  if (prev != null && +prev < n) { bag.classList.remove("bump"); void bag.offsetWidth; bag.classList.add("bump"); }

  el.querySelector("#isl-tiles").innerHTML = PLACES.map(([id, href, ic, s]) =>
    `<a class="tile ${id === current ? "on" : ""}" href="${href}" ${id === current ? 'aria-current="page"' : ""}>${ICON[ic]}<span>${t(s)}</span></a>`).join("") +
    `<button class="tile" type="button" data-lang>${ICON.globe}<span>${lang === "fa" ? "English" : "فارسی"}</span></button>`;
  el.querySelector("#isl-cta").innerHTML = n ? `${ICON.bag}<span>${t("Your bag")} · ${money(bagTotal())}</span>` : `<span>${t("Order ahead")}</span>`;
}
