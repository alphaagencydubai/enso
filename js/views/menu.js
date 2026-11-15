import { MENU, CATS, byId } from "../data.js";
import { t, L, D, money, digits, lang } from "../i18n.js";
import { ICON, photo, esc, label, sheet, toast, ring } from "../ui.js";
import { addToBag, state, emit } from "../store.js";

const TAG = { daily: "Daily", loved: "Most loved", new: "New", signature: "Signature" };

const row = (m) => `
<li><button class="row" type="button" data-act="item" data-id="${m.id}">
  ${photo(m.img, "row-ph", true, L(m))}
  <span class="row-t"><b>${esc(L(m))}${m.tag ? ` <em class="tag">${t(TAG[m.tag])}</em>` : ""}</b><small>${esc(D(m))}</small><span class="row-p">${money(m.price)}</span></span>
  <span class="add-s" data-act="quick" data-id="${m.id}" role="button" aria-label="${t("Add {name} to your bag", { name: esc(L(m)) })}">${ICON.plus}</span>
</button></li>`;

function list(q = "") {
  const s = q.trim().toLowerCase();
  const hit = (m) => !s || [m.en, m.fa, m.den, m.dfa].some((x) => (x || "").toLowerCase().includes(s));
  const out = CATS.map((c) => {
    const items = MENU.filter((m) => m.cat === c.id && hit(m));
    if (!items.length) return "";
    return `<section class="mcat" id="cat-${c.id}" data-cat="${c.id}"><h2 class="mcat-h"><span>${esc(L(c))}</span><small>${digits(items.length)}</small></h2><ul class="list">${items.map(row).join("")}</ul></section>`;
  }).join("");
  return out || `<p class="empty">${ring({ size: 36 })}<span>${t("Nothing by that name — try “roll” or “latte”.")}</span></p>`;
}

export function itemSheet(id) {
  const m = byId(id); if (!m) return;
  const sel = {}; (m.opts || []).forEach((g) => (sel[g.id] = g.choices[0].id));
  let qty = 1;
  const price = () => {
    let p = m.price; (m.opts || []).forEach((g) => { const c = g.choices.find((c) => c.id === sel[g.id]); if (c?.add) p += c.add; }); return p * qty;
  };
  const fav = () => state().favs.includes(m.id);
  sheet(`
    <div class="sheet-hero">${photo(m.img, "item-ph", false, L(m))}</div>
    <div class="item-b">
      ${label(esc(L(CATS.find((c) => c.id === m.cat))))}
      <div class="item-h"><h2>${esc(L(m))}</h2><button class="fav ${fav() ? "on" : ""}" type="button" data-fav aria-label="${t("Save")}">${fav() ? ICON.heartFill : ICON.heart}</button></div>
      <p class="item-d">${esc(D(m))}</p>
      ${(m.opts || []).map((g) => `
        <div class="opt">${label(esc(L(g)))}<div class="seg" role="radiogroup">${g.choices.map((c) => `<button type="button" role="radio" data-g="${g.id}" data-c="${c.id}" aria-checked="${sel[g.id] === c.id}">${esc(L(c))}${c.add ? `<small>+${digits(Math.round(c.add / 1000))}${lang === "fa" ? " هزار" : "k"}</small>` : ""}</button>`).join("")}</div></div>`).join("")}
      <div class="item-foot">
        <span class="stepper big"><button type="button" data-q="-1" aria-label="${t("Less")}">${ICON.minus}</button><b data-qty>${digits(qty)}</b><button type="button" data-q="1" aria-label="${t("More")}">${ICON.plus}</button></span>
        <button class="btn btn-ink grow" type="button" data-addit>${t("Add")} · <span data-price>${money(price())}</span></button>
      </div>
    </div>`, {
    cls: "item-sheet",
    mount(b, close) {
      b.addEventListener("click", (e) => {
        const r = e.target.closest("[data-g]");
        if (r) { sel[r.dataset.g] = r.dataset.c; b.querySelectorAll(`[data-g="${r.dataset.g}"]`).forEach((x) => x.setAttribute("aria-checked", x === r)); }
        const q = e.target.closest("[data-q]");
        if (q) { qty = Math.max(1, qty + +q.dataset.q); b.querySelector("[data-qty]").textContent = digits(qty); }
        if (e.target.closest("[data-fav]")) {
          const f = state().favs; const i = f.indexOf(m.id); i >= 0 ? f.splice(i, 1) : f.push(m.id); emit("favs");
          const btn = b.querySelector("[data-fav]"); btn.classList.toggle("on", fav()); btn.innerHTML = fav() ? ICON.heartFill : ICON.heart;
        }
        if (e.target.closest("[data-addit]")) { addToBag(m.id, qty, { ...sel }); toast(t("{name} is in your bag", { name: esc(L(m)) })); close(); }
        b.querySelector("[data-price]").textContent = money(price());
      });
    },
  });
}

export default {
  id: "menu",
  title: () => t("Menu"),
  render() {
    return `
<section class="pad page-h">
  ${label(t("The card"))}
  <h1 class="h-big">${t("Menu")}</h1>
  <p class="lede">${t("Order ahead and pick it up warm, or tell us your table.")}</p>
  <label class="search">${ICON.search}<input type="search" id="q" placeholder="${t("Search the card")}" autocomplete="off"></label>
</section>
<nav class="chips" id="chips" aria-label="${t("Sections")}">
  ${CATS.map((c, i) => `<button type="button" class="chip${i === 0 ? " on" : ""}" data-act="cat" data-id="${c.id}">${esc(L(c))}</button>`).join("")}
</nav>
<div class="pad" id="mlist">${list()}</div>`;
  },
  mount(el, params) {
    const box = el.querySelector("#mlist");
    const chips = el.querySelector("#chips");
    el.querySelector("#q").addEventListener("input", (e) => { box.innerHTML = list(e.target.value); });
    const go = (id) => {
      const s = el.querySelector("#cat-" + id); if (!s) return;
      const y = s.getBoundingClientRect().top + scrollY - 118;
      scrollTo({ top: y, behavior: "smooth" });
    };
    el.addEventListener("click", (e) => {
      const a = e.target.closest("[data-act]"); if (!a) return;
      if (a.dataset.act === "cat") go(a.dataset.id);
      if (a.dataset.act === "quick") { e.stopPropagation(); const m = byId(a.dataset.id); if (m.opts?.length) itemSheet(m.id); else { addToBag(m.id); toast(t("{name} is in your bag", { name: esc(L(m)) })); } }
      else if (a.dataset.act === "item") itemSheet(a.dataset.id);
    });
    // the chip of the section under the bar follows the scroll
    const io = new IntersectionObserver((es) => {
      es.forEach((x) => {
        if (!x.isIntersecting) return;
        const id = x.target.dataset.cat;
        chips.querySelectorAll(".chip").forEach((c) => c.classList.toggle("on", c.dataset.id === id));
        const on = chips.querySelector(".chip.on"); if (on) on.scrollIntoView({ inline: "center", block: "nearest", behavior: "smooth" });
      });
    }, { rootMargin: "-130px 0px -65% 0px" });
    el.querySelectorAll(".mcat").forEach((s) => io.observe(s));
    if (params.cat) setTimeout(() => go(params.cat), 80);
    if (params.item) setTimeout(() => itemSheet(params.item), 120);
    return () => io.disconnect();
  },
};
