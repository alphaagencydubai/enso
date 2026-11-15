import { byId, ENSO } from "../data.js";
import { t, L, money, digits, clock } from "../i18n.js";
import { ICON, photo, esc, label, sheet, ring } from "../ui.js";
import { state, setQty, bagTotal, bagCount, linePrice, placeOrder, on } from "../store.js";

const optText = (l) => {
  const it = byId(l.id);
  return (it.opts || []).map((g) => { const c = g.choices.find((c) => c.id === l.opts?.[g.id]); return c && c !== g.choices[0] ? L(c) : null; }).filter(Boolean).join(" · ");
};

let mode = "pickup", when = 0, table = "";
function html() {
  const S = state();
  if (!S.bag.length) return `<div class="bag-empty">${ring({ size: 56 })}${label(t("Your bag"))}<h2 class="h-mid">${t("Nothing in it yet.")}</h2><a class="btn btn-ink" href="#/menu" data-x>${t("Open the menu")}</a></div>`;
  return `
  ${label(t("Your bag"))}
  <h2 class="h-mid">${t("{n} things, warm when you arrive.", { n: digits(bagCount()) })}</h2>
  <ul class="bag-lines">${S.bag.map((l) => { const it = byId(l.id); return `
    <li>${photo(it.img, "row-ph", true, L(it))}<span class="row-t"><b>${esc(L(it))}</b><small>${esc(optText(l)) || money(linePrice(l))}</small></span>
    <span class="stepper"><button type="button" data-bq="${l.key}" data-d="-1" aria-label="${t("Less")}">${l.qty === 1 ? ICON.trash : ICON.minus}</button><b>${digits(l.qty)}</b><button type="button" data-bq="${l.key}" data-d="1" aria-label="${t("More")}">${ICON.plus}</button></span></li>`; }).join("")}
  </ul>
  <div class="opt">${label(t("How"))}<div class="seg wide3" role="radiogroup">
    ${[["pickup", ICON.store, t("Pick up")], ["table", ICON.home, t("At my table")], ["delivery", ICON.truck, t("Delivery")]].map(([id, ic, s]) => `<button type="button" role="radio" data-mode="${id}" aria-checked="${mode === id}">${ic}<span>${s}</span></button>`).join("")}
  </div></div>
  ${mode === "table" ? `<label class="field"><span>${t("Table number")}</span><input type="text" inputmode="numeric" data-table value="${esc(table)}" placeholder="${t("On the circle card on your table")}"></label>` : ""}
  ${mode === "delivery" ? `<p class="hint">${t("Delivery runs through ENSO's Snappfood shop — your bag goes with you.")}</p>` : `
  <div class="opt">${label(t("When"))}<div class="seg" role="radiogroup">${[0, 15, 30, 45].map((m) => `<button type="button" role="radio" data-when="${m}" aria-checked="${when === m}">${m ? t("In {m} min", { m: digits(m) }) : t("Now")}</button>`).join("")}</div></div>`}
  <div class="total"><span>${t("Total")}</span><b>${money(bagTotal())}</b></div>
  ${mode === "delivery"
    ? `<a class="btn btn-ink full" href="${ENSO.snappfood}" target="_blank" rel="noopener">${t("Continue on Snappfood")}</a>`
    : `<button class="btn btn-ink full" type="button" data-place>${t("Place order · pay at the counter")}</button>`}`;
}

function confirm(o) {
  sheet(`<div class="done">
    <div class="done-ring">${ring({ size: 84, fill: 1, cls: "draw" })}</div>
    ${label(t("Order placed"))}
    <h2 class="h-mid">${t("It's in the circle.")}</h2>
    <p class="code">${digits(o.code)}</p>
    <p class="hint center">${o.mode === "table" ? t("We'll bring it to table {n}.", { n: digits(o.table || "—") }) : t("Show this number at the counter. The island at the bottom follows your order.")}</p>
    <button class="btn btn-ink full" type="button" data-x>${t("Done")}</button></div>`);
}

export function openBag() {
  sheet(`<div class="bag" id="bagb">${html()}</div>`, {
    cls: "bag-sheet",
    mount(b, close) {
      const off = on((w) => { if (w === "bag") b.querySelector("#bagb").innerHTML = html(); });
      const re = () => (b.querySelector("#bagb").innerHTML = html());
      b.addEventListener("click", (e) => {
        const q = e.target.closest("[data-bq]");
        if (q) { const l = state().bag.find((l) => l.key === q.dataset.bq); setQty(l.key, l.qty + +q.dataset.d); return; }
        const m = e.target.closest("[data-mode]"); if (m) { mode = m.dataset.mode; re(); return; }
        const w = e.target.closest("[data-when]"); if (w) { when = +w.dataset.when; re(); return; }
        if (e.target.closest("[data-place]")) {
          const o = placeOrder(mode, when); o.table = table; close(); setTimeout(() => confirm(o), 320);
        }
      });
      b.addEventListener("input", (e) => { if (e.target.matches("[data-table]")) table = e.target.value; });
      return off;
    },
    onClose() {},
  });
}
