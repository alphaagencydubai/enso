import { PIECES, SETS, OCCASIONS, TIERS, BOX, DELIVERY, DEPOSIT } from "../data.js";
import { t, L, D, money, digits, num, dateLabel, weekday, dayNum, clock, isFa } from "../i18n.js";
import { ICON, photo, esc, label, sheet, toast, ring } from "../ui.js";
import { state, quote, requestGathering, G_STAGES, emit } from "../store.js";

const TIMES = [10, 12, 14, 16, 18, 20];
let g = null;
const fresh = () => {
  const p = state().profile;
  return { occasion: "birthday", guests: 40, day: null, time: 18, mode: "pickup", address: "", set: null, items: {},
    boxes: true, card: "", name: p.name || "", phone: p.phone || "", note: "" };
};

const lead = () => (g.guests >= 100 ? 2 : 1);
const days = () => Array.from({ length: 14 }, (_, i) => { const d = new Date(); d.setHours(12, 0, 0, 0); d.setDate(d.getDate() + lead() + i); return d; });

function applySet(id) {
  const s = SETS.find((s) => s.id === id); g.set = id; g.items = {};
  s.per.forEach(([pid, per]) => {
    const p = PIECES.find((p) => p.id === pid);
    const want = Math.max(1, Math.ceil(g.guests * per));
    g.items[pid] = Math.ceil(want / p.unit) * p.unit;
  });
}

const sec = (n, title, body, extra = "") => `
<section class="gsec ${extra}"><div class="gsec-h"><span class="gnum">${digits(String(n).padStart(2, "0"))}</span>${label(title)}</div>${body}</section>`;

function piecesHtml() {
  return `<ul class="plist">${PIECES.map((p) => {
    const q = g.items[p.id] || 0;
    return `<li class="${q ? "has" : ""}">${photo(p.img, "row-ph", true, L(p))}<span class="row-t"><b>${esc(L(p))}</b><small>${money(p.price)} · ${p.unit > 1 ? t("by {n}", { n: digits(p.unit) }) : t("each")}</small></span>
      <span class="stepper"><button type="button" data-act="pq" data-id="${p.id}" data-d="-1" ${q ? "" : "disabled"} aria-label="${t("Less")}">${ICON.minus}</button><b>${digits(q)}</b><button type="button" data-act="pq" data-id="${p.id}" data-d="1" aria-label="${t("More")}">${ICON.plus}</button></span></li>`;
  }).join("")}</ul>`;
}

function body() {
  const ds = days();
  if (!g.day || new Date(g.day) < ds[0]) g.day = ds[0].toISOString();
  const q = quote(g);
  const next = TIERS.slice().reverse().find((t) => q.pieces < t.min);
  return `
${sec(1, t("Occasion"), `<div class="occ">${OCCASIONS.map((o) => `<button type="button" class="pillbtn ${g.occasion === o.id ? "on" : ""}" data-act="occ" data-id="${o.id}">${esc(L(o))}</button>`).join("")}</div>`)}

${sec(2, t("Guests"), `
  <div class="guests">
    <button type="button" class="round" data-act="guests" data-d="-5" aria-label="${t("Fewer guests")}">${ICON.minus}</button>
    <div class="gcount"><b>${digits(g.guests)}</b><small>${t("guests")}</small></div>
    <button type="button" class="round" data-act="guests" data-d="5" aria-label="${t("More guests")}">${ICON.plus}</button>
  </div>
  <input class="range" type="range" min="10" max="500" step="5" value="${g.guests}" id="grange" aria-label="${t("Guests")}" style="--v:${(g.guests - 10) / 490}">
  <p class="hint">${g.guests >= 100 ? t("For 100 guests or more we bake two days ahead.") : t("We need a day's notice. Over 100 guests, two.")}</p>`)}

${sec(3, t("Day & time"), `
  <div class="days" id="days">${ds.map((d) => `<button type="button" class="day ${new Date(g.day).toDateString() === d.toDateString() ? "on" : ""}" data-act="day" data-id="${d.toISOString()}"><small>${weekday(d)}</small><b>${dayNum(d)}</b></button>`).join("")}</div>
  <div class="times">${TIMES.map((h) => `<button type="button" class="pillbtn ${g.time === h ? "on" : ""}" data-act="time" data-id="${h}">${clock(h)}</button>`).join("")}</div>`)}

${sec(4, t("The spread"), `
  <p class="hint">${t("Start from a set — it scales with your guests — then change anything.")}</p>
  <div class="sets">${SETS.map((s) => `<button type="button" class="set ${g.set === s.id ? "on" : ""}" data-act="set" data-id="${s.id}">${photo(s.img, "set-ph", true, L(s))}<span><b>${esc(L(s))}</b><small>${esc(D(s))}</small></span><i class="set-check">${ICON.check}</i></button>`).join("")}</div>
  ${piecesHtml()}`)}

${sec(5, t("Boxes & card"), `
  <label class="toggle-row"><span class="tr-ic">${ring({ size: 26 })}</span><span class="row-t"><b>${t("ENSO gift boxes")}</b><small>${t("The circle box, {n} pieces each · {p} a box", { n: digits(BOX.holds), p: money(BOX.price) })}</small></span><input type="checkbox" class="switch" data-act="boxes" ${g.boxes ? "checked" : ""}></label>
  <label class="field"><span>${t("A line for the printed card")}</span><input type="text" maxlength="60" data-f="card" value="${esc(g.card)}" placeholder="${t("Happy birthday, Sara — with love")}"></label>`)}

${sec(6, t("Pickup or delivery"), `
  <div class="seg wide" role="radiogroup">
    <button type="button" role="radio" data-act="mode" data-id="pickup" aria-checked="${g.mode === "pickup"}">${ICON.store}<span>${t("Pick up at ENSO")}</span></button>
    <button type="button" role="radio" data-act="mode" data-id="delivery" aria-checked="${g.mode === "delivery"}">${ICON.truck}<span>${t("Deliver · {p}", { p: money(DELIVERY) })}</span></button>
  </div>
  ${g.mode === "delivery" ? `<label class="field"><span>${t("Address in Tabriz")}</span><textarea rows="2" data-f="address" placeholder="${t("Street, building, floor")}">${esc(g.address)}</textarea></label>` : ""}`)}

${sec(7, t("Your details"), `
  <label class="field"><span>${t("Name")}</span><input type="text" data-f="name" value="${esc(g.name)}" autocomplete="name"></label>
  <label class="field"><span>${t("Mobile")}</span><input type="tel" inputmode="tel" dir="ltr" data-f="phone" value="${esc(g.phone)}" placeholder="0914 ••• •• ••" autocomplete="tel"></label>
  <label class="field"><span>${t("Anything we should know?")}</span><textarea rows="2" data-f="note" placeholder="${t("Allergies, a theme colour, a candle…")}">${esc(g.note)}</textarea></label>`)}

<div class="gsum-pad"></div>
<div class="gsum" id="gsum">
  <div class="gsum-t"><b>${q.pieces ? t("{n} pieces", { n: digits(q.pieces) }) : t("Nothing chosen yet")}</b><small>${q.pieces ? (next ? t("{n} more for {p}% off", { n: digits(next.min - q.pieces), p: digits(Math.round(next.off * 100)) }) : t("{p}% off applied", { p: digits(Math.round(q.tier.off * 100)) })) : t("Pick a set to begin")}</small></div>
  <button class="btn btn-ink" type="button" data-act="review" ${q.pieces ? "" : "disabled"}>${q.pieces ? money(q.total) : t("Review")}</button>
</div>`;
}

function mine() {
  const list = state().gatherings;
  if (!list.length) return "";
  return `<section class="block pad"><div class="block-h">${label(t("Your requests"))}</div><ul class="list">${list.map((r) => `
    <li class="req"><span class="req-ring">${ring({ size: 30, fill: Math.min(3, r.status + 1) })}</span><span class="row-t"><b>${esc(L(OCCASIONS.find((o) => o.id === r.occasion)))} ·${digits(r.guests)} ${t("guests")}</b><small>${dateLabel(r.day)} · ${clock(r.time)} · ${digits(r.code)}</small></span><span class="badge s${r.status}">${t(G_STAGES[r.status])}</span></li>`).join("")}</ul></section>`;
}

function review(el) {
  const q = quote(g);
  const occ = OCCASIONS.find((o) => o.id === g.occasion);
  sheet(`
    <div class="sum">
      ${label(t("Your gathering"))}
      <h2 class="h-mid">${esc(L(occ))}<br><span class="muted">${t("{n} guests", { n: digits(g.guests) })} · ${dateLabel(g.day)} · ${clock(g.time)}</span></h2>
      <ul class="lines">${q.lines.map((l) => { const p = PIECES.find((p) => p.id === l.id); return `<li><span>${digits(l.qty)} × ${esc(L(p))}</span><b>${money(l.sum)}</b></li>`; }).join("")}
        ${q.off ? `<li class="good"><span>${t("Gathering price · {p}% off", { p: digits(Math.round(q.tier.off * 100)) })}</span><b>−${money(q.off)}</b></li>` : ""}
        ${q.box ? `<li><span>${t("{n} ENSO gift boxes", { n: digits(q.boxes) })}</span><b>${money(q.box)}</b></li>` : ""}
        ${q.del ? `<li><span>${t("Delivery in Tabriz")}</span><b>${money(q.del)}</b></li>` : ""}
      </ul>
      <div class="total"><span>${t("Total")}</span><b>${money(q.total)}</b></div>
      <div class="deposit">${ring({ size: 22, fill: 1 })}<span>${t("{d} now holds the date ({p}%). The rest when you collect.", { d: `<b>${money(q.deposit)}</b>`, p: digits(DEPOSIT * 100) })}</span></div>
      ${!g.name || !g.phone ? `<p class="warn">${t("Add your name and mobile so we can call you back.")}</p>` : ""}
      <button class="btn btn-ink full" type="button" data-send ${!g.name || !g.phone ? "disabled" : ""}>${t("Send request")}</button>
      <p class="hint center">${t("ENSO calls you within the hour to confirm. Nothing is charged in this preview.")}</p>
    </div>`, {
    mount(b, close) {
      b.querySelector("[data-send]")?.addEventListener("click", () => {
        const p = state().profile; if (!p.name) p.name = g.name; if (!p.phone) p.phone = g.phone;
        const rec = requestGathering(g); close();
        setTimeout(() => done(rec), 320);
        g = fresh(); paint(el);
      });
    },
  });
}

function done(rec) {
  sheet(`
    <div class="done">
      <div class="done-ring">${ring({ size: 84, fill: 1, cls: "draw" })}</div>
      ${label(t("Request sent"))}
      <h2 class="h-mid">${t("We have your date.")}</h2>
      <p class="code">${digits(rec.code)}</p>
      <ol class="steps">
        ${G_STAGES.map((s, i) => `<li class="${i <= rec.status ? "on" : ""}"><i></i><span>${t(s)}</span><small>${[t("Now"), t("Within the hour"), t("When you're ready"), dateLabel(new Date(new Date(rec.day).getTime() - 864e5), { weekday: false }), dateLabel(rec.day, { weekday: false })][i]}</small></li>`).join("")}
      </ol>
      <a class="btn btn-ink full" href="#/profile" data-x>${t("See it in your profile")}</a>
    </div>`);
}

function paint(el) {
  el.querySelector("#gbody").innerHTML = body();
  el.querySelector("#gmine").innerHTML = mine();
}

export default {
  id: "gather",
  title: () => t("Gatherings"),
  render() {
    if (!g) g = fresh();
    return `
<section class="ghero">
  <span class="rings" aria-hidden="true"></span>
  <div class="pad">
    ${label(t("Ceremonies & parties"))}
    <h1 class="h-big">${t("Gatherings")}</h1>
    <p class="lede">${t("Birthdays, weddings, the office, a memorial. Tell us how many — we bake it, box it in our circle and have it ready on the hour.")}</p>
  </div>
  <div class="ghero-ph pad">${photo({ src: "box", pos: "50% 45%", zoom: 1 }, "", false)}${photo({ src: "comfort", pos: "50% 50%", zoom: 1 }, "", true)}</div>
</section>
<div class="pad" id="gbody"></div>
<div id="gmine"></div>`;
  },
  mount(el) {
    paint(el);
    const re = () => { const y = scrollY; paint(el); scrollTo(0, y); };
    el.addEventListener("click", (e) => {
      const a = e.target.closest("[data-act]"); if (!a) return;
      const id = a.dataset.id, d = +a.dataset.d;
      switch (a.dataset.act) {
        case "occ": g.occasion = id; if (id === "memorial" && !g.set) applySet("quiet"); if (id === "office" && !g.set) applySet("office"); break;
        case "guests": g.guests = Math.min(500, Math.max(10, g.guests + d)); if (g.set) applySet(g.set); break;
        case "day": g.day = id; break;
        case "time": g.time = +id; break;
        case "set": applySet(id); break;
        case "pq": { const p = PIECES.find((p) => p.id === id); g.items[id] = Math.max(0, (g.items[id] || 0) + d * p.unit); g.set = null; break; }
        case "mode": g.mode = id; break;
        case "boxes": g.boxes = a.checked; break;
        case "review": review(el); return;
        default: return;
      }
      const dx = el.querySelector("#days")?.scrollLeft;
      re();
      if (dx != null && el.querySelector("#days")) el.querySelector("#days").scrollLeft = dx;
    });
    el.addEventListener("input", (e) => {
      if (e.target.id === "grange") {
        g.guests = +e.target.value; e.target.style.setProperty("--v", (g.guests - 10) / 490);
        if (g.set) applySet(g.set);
        el.querySelector(".gcount b").textContent = digits(g.guests);
      }
      const f = e.target.dataset.f; if (f) g[f] = e.target.value;
    });
    el.addEventListener("change", (e) => { if (e.target.id === "grange") re(); if (e.target.dataset.f === "name" || e.target.dataset.f === "phone") re(); });
  },
};
