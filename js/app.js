import { t, lang, onLang, digits } from "./i18n.js";
import { WORD, ring, closeSheets } from "./ui.js";
import { on, tick, state } from "./store.js";
import { mountIsland, setPlace, update as islandUpdate } from "./island.js";
import home from "./views/home.js";
import menu from "./views/menu.js";
import gather from "./views/gather.js";
import profile from "./views/profile.js";
import crm from "./views/crm.js";
import { itemSheet } from "./views/menu.js";
import { addToBag } from "./store.js";
import { toast, esc } from "./ui.js";
import { byId } from "./data.js";
import { L } from "./i18n.js";

const VIEWS = { "": home, menu, gather, profile, crm };
const view = document.getElementById("view");
const bar = document.getElementById("bar");
let cur = null, cleanup = null, curParams = {};

function parse() {
  const h = location.hash.replace(/^#\/?/, "");
  const [path, qs] = h.split("?");
  const params = Object.fromEntries(new URLSearchParams(qs || ""));
  const [name, sub] = path.split("/");
  if (sub) params.tab = sub;
  return { v: VIEWS[name] || home, params };
}

const footer = () => `
<footer class="foot pad">
  <div class="foot-brand">${ring({ size: 26 })}<span><b>ENSO</b><small>${t("Circle of togetherness")}</small></span></div>
  <a class="alpha" href="https://alphaa.agency" target="_blank" rel="noopener" dir="ltr"><img src="assets/brand/alpha-black.png" alt="" width="30" height="23"><span><small>Powered by</small><b>Alpha Agency</b></span></a>
</footer>`;

function render(scroll = true) {
  const { v, params } = parse();
  const same = v === cur;
  if (cleanup) { try { cleanup(); } catch (e) {} cleanup = null; }
  cur = v; curParams = params;
  view.innerHTML = `<div class="page page-${v.id}">${v.render(params)}${footer()}</div>`;
  const rerender = () => { const y = scrollY; render(false); scrollTo(0, y); };
  cleanup = v.mount ? v.mount(view.firstElementChild, params, rerender) : null;
  setPlace(v.id);
  document.title = v.id === "home" ? t("ENSO — Cafe & Bakery, Tabriz") : `${v.title()} · ENSO`;
  bar.querySelector(".bar-title").textContent = v.id === "home" ? "" : v.title();
  if (scroll && !same) scrollTo(0, 0);
  if (!same) view.firstElementChild.classList.add("enter");
}

function paintBar() {
  bar.innerHTML = `
    <a class="bar-logo" href="#/" aria-label="${t("ENSO — home")}">${WORD()}</a>
    <span class="bar-title" aria-hidden="true"></span>
    <button class="bar-lang" type="button" data-lang aria-label="${t("Switch to {l}", { l: lang === "fa" ? "English" : "فارسی" })}"><span class="${lang === "en" ? "on" : ""}">EN</span><span class="${lang === "fa" ? "on" : ""}">فا</span></button>`;
}

// global taps: quick-add buttons that live outside a view's own handler
document.addEventListener("click", (e) => {
  const a = e.target.closest("[data-act=add]");
  if (a) { const m = byId(a.dataset.id); if (m.opts?.length) itemSheet(m.id); else { addToBag(m.id); toast(t("{name} is in your bag", { name: esc(L(m)) })); } }
  if (e.target.closest("[data-lang]") && e.target.closest("#bar")) {
    import("./i18n.js").then((m) => m.setLang(lang === "fa" ? "en" : "fa"));
  }
});

// the bar hides on the way down, returns on the way up
let lastY = 0;
addEventListener("scroll", () => {
  const y = scrollY;
  bar.classList.toggle("scrolled", y > 8);
  bar.classList.toggle("titled", y > 120);
  if (!document.documentElement.classList.contains("has-sheet")) {
    if (y > 140 && y > lastY + 2) bar.classList.add("hide");
    else if (y < lastY - 2 || y <= 140) bar.classList.remove("hide");
  }
  lastY = y;
}, { passive: true });

addEventListener("hashchange", () => { closeSheets(); render(); });
onLang(() => { paintBar(); mountIsland(); render(false); });
on((what) => {
  islandUpdate();
  if ((what === "order" || what === "gathering" || what === "all") && (cur?.id === "profile" || cur?.id === "crm" || cur?.id === "home") && !document.documentElement.classList.contains("has-sheet")) {
    const y = scrollY; render(false); scrollTo(0, y);
  }
});
setInterval(() => { tick(); islandUpdate(); }, 5000);

paintBar();
mountIsland();
render();

// the opening screen leaves once the first page has painted (and the circle has drawn)
const boot = document.getElementById("boot");
if (boot) {
  const warm = document.documentElement.classList.contains("boot-warm");
  setTimeout(() => {
    boot.classList.add("out");
    document.documentElement.classList.remove("booting");
    setTimeout(() => boot.remove(), 700);
    try { sessionStorage.setItem("enso.v1.booted", "1"); } catch (e) {}
  }, warm ? 250 : 1500);
}

if ("serviceWorker" in navigator && !/[?&]nosw/.test(location.search) && !["localhost", "127.0.0.1"].includes(location.hostname)) {
  addEventListener("load", () => navigator.serviceWorker.register("sw.js").catch(() => {}));
}
