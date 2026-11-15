import { byId, OCCASIONS, SETS } from "../data.js";
import { t, L, pct, money, moneyShort, digits, num, dateLabel, weekday, clock, ago, lang, isFa } from "../i18n.js";
import { ICON, photo, esc, label, ring, sheet, toast } from "../ui.js";
import { state, emit, advance, moveGathering, G_STAGES } from "../store.js";
import { CUSTOMERS, WEEK, TOP, QUEUE, GATHER_SEED, custById } from "../crmdata.js";

let tab = "today", seg = "all", q = "";
const TABS = [["today", "Today"], ["customers", "Customers"], ["gatherings", "Gatherings"], ["campaigns", "Campaigns"]];
const name = (c) => (lang === "fa" ? c.fa : c.en);
const initials = (c) => (lang === "fa" ? c.fa[0] : c.en.split(" ").map((w) => w[0]).join("").slice(0, 2));
const stage = ["Received", "In the oven", "Ready", "Collected"];

// ---- today -------------------------------------------------------------
function queue() {
  const S = state();
  const mine = S.orders.filter((o) => o.stage < 3 && Date.now() - o.at < 3 * 3600e3).map((o) => ({
    code: o.code, who: null, me: S.profile.name || t("Guest on the app"), lines: o.lines.map((l) => [l.id, l.qty]), stage: o.stage,
    min: Math.max(0, Math.ceil((o.eta - Date.now()) / 60000)), mode: o.mode, table: o.table, live: true }));
  const seeded = QUEUE.map((x) => ({ ...x, stage: S.crm.moved["q" + x.code] ?? x.stage })).filter((x) => x.stage < 3);
  return [...mine, ...seeded];
}

function today() {
  const W = WEEK, d = W[6];
  const S = state();
  const mineRev = S.orders.filter((o) => new Date(o.at).toDateString() === new Date().toDateString()).reduce((a, o) => a + o.total, 0);
  const rev = d.rev + mineRev, orders = d.orders + S.orders.filter((o) => new Date(o.at).toDateString() === new Date().toDateString()).length;
  const max = Math.max(...W.map((w) => w.rev));
  const Q = queue();
  const topMax = TOP[0].n;
  return `
<div class="kpis">
  <div class="kpi"><small>${t("Takings today")}</small><b>${moneyShort(rev)}</b><em class="up">${pct("+12")}</em></div>
  <div class="kpi"><small>${t("Orders")}</small><b>${digits(orders)}</b><em>${t("{n} on the app", { n: digits(Math.round(orders * 0.34)) })}</em></div>
  <div class="kpi"><small>${t("Average ticket")}</small><b>${moneyShort(Math.round(rev / orders / 1e4) * 1e4)}</b></div>
  <div class="kpi"><small>${t("Came back")}</small><b>${pct(68)}</b><em>${t("of today's guests")}</em></div>
</div>

<section class="cblock">
  <div class="block-h">${label(t("This week"))}<span class="cap">${moneyShort(W.reduce((a, w) => a + w.rev, 0) + mineRev)}</span></div>
  <div class="bars" role="img" aria-label="${t("Takings, last seven days")}">${W.map((w, i) => `<span class="cbar ${i === 6 ? "now" : ""}" style="--h:${((i === 6 ? w.rev + mineRev : w.rev) / max).toFixed(3)}"><i></i><small>${weekday(w.d).slice(0, lang === "fa" ? 9 : 3)}</small></span>`).join("")}</div>
</section>

<section class="cblock">
  <div class="block-h">${label(t("At the counter"))}<span class="status is-open"><i class="dot"></i>${t("{n} live", { n: digits(Q.length) })}</span></div>
  <ul class="queue">${Q.map((o) => `
    <li class="${o.live ? "me" : ""}">
      <span class="qn">${digits(o.code)}</span>
      <span class="row-t"><b>${o.who ? esc(name(custById(o.who))) : esc(o.me)}${o.live ? ` <em class="tag">${t("from the app")}</em>` : ""}</b><small>${o.lines.map(([id, n]) => `${digits(n)}× ${esc(L(byId(id)))}`).join("، ")}</small><small>${o.mode === "table" ? t("Table {n}", { n: digits(o.table || "—") }) : t("Pick up")}${o.stage < 2 ? " · " + t("{m} min", { m: digits(o.min || 1) }) : ""}</small></span>
      <button type="button" class="qbtn s${o.stage}" data-act="adv" data-id="${o.code}" data-live="${o.live ? 1 : 0}">${t(stage[o.stage])}<i>${ICON.chev}</i></button>
    </li>`).join("") || `<li class="hint">${t("The counter is clear.")}</li>`}</ul>
</section>

<section class="cblock">
  <div class="block-h">${label(t("Best sellers · 7 days"))}</div>
  <ul class="tops">${TOP.map((x) => { const m = byId(x.id); return `<li>${photo(m.img, "top-ph", true, L(m))}<span class="row-t"><b>${esc(L(m))}</b><span class="tbar"><i style="--w:${(x.n / topMax).toFixed(3)}"></i></span></span><span class="row-p">${digits(x.n)}</span></li>`; }).join("")}</ul>
</section>`;
}

// ---- customers -----------------------------------------------------------
const SEGS = [["all", "Everyone"], ["Regular", "Regulars"], ["VIP", "VIP"], ["New", "New"], ["drift", "Drifting"], ["bday", "Birthdays soon"]];
const soonBday = (c) => { const d = (new Date(c.birthday) - Date.now()) / 864e5; return d > -1 && d < 14; };
function filterC() {
  const s = q.trim().toLowerCase();
  return CUSTOMERS.filter((c) => {
    if (s && !(c.en.toLowerCase().includes(s) || c.fa.includes(s) || c.phone.replace(/\s/g, "").includes(s.replace(/\s/g, "")))) return false;
    if (seg === "all") return true;
    if (seg === "drift") return c.last >= 30 && c.visits >= 5;
    if (seg === "bday") return soonBday(c);
    return c.tags.includes(seg);
  });
}
function custList() {
  const list = filterC();
  return `<p class="hint">${t("{n} people", { n: digits(list.length) })}</p><ul class="clist">${list.map((c) => `
    <li><button type="button" class="crow" data-act="cust" data-id="${c.id}">
      <span class="av">${esc(initials(c))}</span>
      <span class="row-t"><b>${esc(name(c))}${c.tags.includes("VIP") ? ` <em class="tag">VIP</em>` : ""}</b><small>${t("{n} visits", { n: digits(c.visits) })} · ${ago(c.last)}</small></span>
      <span class="row-p">${moneyShort(c.spend)}</span>
    </button></li>`).join("")}</ul>`;
}
function customers() {
  return `
  <label class="search">${ICON.search}<input type="search" id="cq" value="${esc(q)}" placeholder="${t("Name or mobile")}" autocomplete="off"></label>
  <div class="chips inline">${SEGS.map(([id, s]) => `<button type="button" class="chip ${seg === id ? "on" : ""}" data-act="seg" data-id="${id}">${t(s)}</button>`).join("")}</div>
  <div id="clist">${custList()}</div>`;
}

function custSheet(id) {
  const c = custById(id), S = state(); const fav = byId(c.fav);
  const note = S.crm.notes[id] || "";
  const visits = Array.from({ length: Math.min(5, c.visits) }, (_, i) => c.last + i * (3 + (i * 7) % 9));
  sheet(`
    <div class="cust">
      <div class="cust-h"><span class="av big">${esc(initials(c))}</span><div>${label(c.tags.map((x) => t(x)).join(" · ") || t("Guest"))}<h2 class="h-mid">${esc(name(c))}</h2><p class="muted" dir="ltr">${digits(c.phone)}</p></div></div>
      <div class="kpis three">
        <div class="kpi"><small>${t("Visits")}</small><b>${digits(c.visits)}</b></div>
        <div class="kpi"><small>${t("Spent")}</small><b>${moneyShort(c.spend)}</b></div>
        <div class="kpi"><small>${t("Stamps")}</small><b>${digits(c.stamps)}/${digits(10)}</b></div>
      </div>
      <div class="cfav">${photo(fav.img, "row-ph", true, L(fav))}<span class="row-t">${label(t("Usually orders"))}<b>${esc(L(fav))}</b></span></div>
      <dl class="facts">
        <div><dt>${t("Birthday")}</dt><dd>${dateLabel(c.birthday, { weekday: false })}${soonBday(c) ? ` · <em class="tag">${t("soon")}</em>` : ""}</dd></div>
        <div><dt>${t("Guest since")}</dt><dd>${dateLabel(c.since, { weekday: false, year: true })}</dd></div>
        <div><dt>${t("Last visit")}</dt><dd>${ago(c.last)}</dd></div>
        <div><dt>${t("Average ticket")}</dt><dd>${money(c.avg)}</dd></div>
      </dl>
      ${label(t("Recent visits"))}
      <ol class="visits">${visits.map((d) => { const dt = new Date(); dt.setDate(dt.getDate() - d); return `<li><i></i><span>${dateLabel(dt)}</span><small>${money(c.avg + ((d * 37) % 7) * 10000)}</small></li>`; }).join("")}</ol>
      <label class="field"><span>${t("Note for the team")}</span><textarea rows="2" data-note placeholder="${t("Oat milk, sits by the window…")}">${esc(note)}</textarea></label>
      <div class="visit-row">
        <a class="btn btn-line" href="tel:${c.phone.replace(/\s/g, "")}">${ICON.phone}<span>${t("Call")}</span></a>
        <button class="btn btn-ink" type="button" data-offer>${ICON.send}<span>${t("Send an offer")}</span></button>
      </div>
    </div>`, {
    mount(b, close) {
      b.querySelector("[data-note]").addEventListener("change", (e) => { state().crm.notes[id] = e.target.value; emit("crm"); toast(t("Note saved")); });
      b.querySelector("[data-offer]").addEventListener("click", () => { close(); setTimeout(() => compose({ who: [c], key: "personal" }), 320); });
    },
  });
}

// ---- gatherings pipeline ----------------------------------------------------
function allGatherings() {
  const S = state();
  const mine = S.gatherings.map((g) => ({ ...g, mine: true }));
  const seed = GATHER_SEED.map((g) => ({ ...g, status: S.crm.moved[g.code] ?? g.status }));
  return [...mine, ...seed].sort((a, b) => (a.status === 4) - (b.status === 4) || new Date(a.day) - new Date(b.day));
}
function gatherings() {
  const all = allGatherings();
  const open = all.filter((g) => g.status < 4);
  const value = open.reduce((a, g) => a + g.total, 0);
  return `
  <div class="kpis three">
    <div class="kpi"><small>${t("Open")}</small><b>${digits(open.length)}</b></div>
    <div class="kpi"><small>${t("Pipeline")}</small><b>${moneyShort(value)}</b></div>
    <div class="kpi"><small>${t("Pieces to bake")}</small><b>${num(open.reduce((a, g) => a + (g.pieces || 0), 0))}</b></div>
  </div>
  <div class="pipe">${G_STAGES.map((s, i) => `<span class="${i === 4 ? "" : "on"}"><b>${digits(all.filter((g) => g.status === i).length)}</b><small>${t(s)}</small></span>`).join("")}</div>
  <ul class="gcards">${all.map((g) => {
    const c = g.who ? custById(g.who) : null; const occ = OCCASIONS.find((o) => o.id === g.occasion);
    const days = Math.round((new Date(g.day) - new Date().setHours(12, 0, 0, 0)) / 864e5);
    return `<li class="gcard ${g.mine ? "me" : ""} ${g.status === 4 ? "past" : ""}">
      <div class="gc-top"><span class="badge s${g.status}">${t(G_STAGES[g.status])}</span><span class="cap">${digits(g.code)}</span></div>
      <b>${esc(L(occ))} · ${digits(g.guests)} ${t("guests")}</b>
      <small>${c ? esc(name(c)) : esc(g.name || t("Guest on the app"))}${g.mine ? ` <em class="tag">${t("from the app")}</em>` : ""}</small>
      <small>${dateLabel(g.day)} · ${clock(g.time)} · ${days > 0 ? t("in {n} days", { n: digits(days) }) : days === 0 ? t("today") : t("done")}</small>
      <div class="gc-foot"><span>${money(g.total)}</span>
        <span class="gc-btns">${g.status > 0 ? `<button type="button" class="round sm" data-act="gmove" data-id="${g.code}" data-to="${g.status - 1}" aria-label="${t("Back a step")}">${ICON.back}</button>` : ""}${g.status < 4 ? `<button type="button" class="btn btn-ink sm" data-act="gmove" data-id="${g.code}" data-to="${g.status + 1}">${t(G_STAGES[g.status + 1])}</button>` : ""}</span></div>
    </li>`;
  }).join("")}</ul>`;
}

// ---- campaigns -------------------------------------------------------------
const CAMPAIGNS = [
  { key: "bday", title: "Birthdays in the next two weeks", who: () => CUSTOMERS.filter(soonBday),
    en: "Happy birthday from ENSO! A slice of San Sebastián is on us this week — just show this message.",
    fa: "تولدت مبارک از طرف اِن سو! این هفته یک برش سن سباستین مهمان ما باش؛ فقط همین پیام را نشان بده." },
  { key: "drift", title: "Regulars we haven't seen in 30 days", who: () => CUSTOMERS.filter((c) => c.last >= 30 && c.visits >= 5),
    en: "We've missed you at ENSO. Your next coffee is on us — the circle isn't the same without you.",
    fa: "دلمان برایت تنگ شده. قهوه‌ی بعدی مهمان اِن سو؛ دایره بدون تو کامل نیست." },
  { key: "gather", title: "Gathering clients · Yalda boxes", who: () => CUSTOMERS.filter((c) => c.tags.includes("Gatherings")),
    en: "Yalda night boxes are open at ENSO: pomegranate tarts and pistachio rolls, from 12 pieces. Reserve in the app.",
    fa: "باکس‌های شب یلدای اِن سو آماده‌ی سفارش است: تارت انار و رول پسته، از ۱۲ عدد. از اپ رزرو کنید." },
  { key: "pist", title: "Pistachio lovers · new pistachio latte", who: () => CUSTOMERS.filter((c) => ["ny-pistachio", "pistachio-latte"].includes(c.fav)),
    en: "New at ENSO: the pistachio latte, made with our own pistachio paste. Try it with your roll.",
    fa: "تازه در اِن سو: لاته پسته با خمیر پسته‌ی خودمان. کنار رولت امتحانش کن." },
];
function campaigns() {
  const sent = state().crm.sent;
  return `
  <p class="hint">${t("Audiences ENSO's book suggests this week. Each message goes out in the guest's language.")}</p>
  <ul class="camps">${CAMPAIGNS.map((c) => { const who = c.who(); return `
    <li><button type="button" class="camp" data-act="camp" data-id="${c.key}">
      <span class="camp-n">${digits(who.length)}</span>
      <span class="row-t"><b>${t(c.title)}</b><small>${esc(lang === "fa" ? c.fa : c.en)}</small></span>${ICON.chev}
    </button></li>`; }).join("")}</ul>
  ${sent.length ? `<div class="block-h">${label(t("Sent"))}</div><ul class="list">${sent.map((s) => `<li class="ord"><span class="row-t"><b>${t(s.title)}</b><small>${dateLabel(s.at)} · ${t(s.ch)}</small></span><span class="row-p">${t("{n} people", { n: digits(s.n) })}</span></li>`).join("")}</ul>` : ""}`;
}
function compose({ key, who }) {
  const c = CAMPAIGNS.find((x) => x.key === key);
  const list = who || c.who();
  let ch = "SMS";
  const msg = c ? (lang === "fa" ? c.fa : c.en) : (lang === "fa" ? `سلام ${list[0].fa.split(" ")[0]}، قهوه‌ی بعدی‌ات مهمان اِن سو. منتظرت هستیم.` : `Hi ${list[0].en.split(" ")[0]}, your next coffee is on ENSO. See you soon.`);
  sheet(`<div class="compose">
    ${label(c ? t(c.title) : t("Send an offer"))}
    <h2 class="h-mid">${list.length === 1 ? esc(name(list[0])) : t("{n} people", { n: digits(list.length) })}</h2>
    <div class="avs">${list.slice(0, 7).map((x) => `<span class="av">${esc(initials(x))}</span>`).join("")}${list.length > 7 ? `<span class="av more">+${digits(list.length - 7)}</span>` : ""}</div>
    <div class="opt">${label(t("Channel"))}<div class="seg" role="radiogroup">${["SMS", "Telegram", "Instagram"].map((x, i) => `<button type="button" role="radio" data-ch="${x}" aria-checked="${i === 0}">${t(x)}</button>`).join("")}</div></div>
    <label class="field"><span>${t("Message")}</span><textarea rows="4" data-msg>${esc(msg)}</textarea></label>
    <div class="bubble">${ring({ size: 18 })}<p data-prev>${esc(msg)}</p></div>
    <button class="btn btn-ink full" type="button" data-send>${t("Send to {n}", { n: digits(list.length) })}</button>
  </div>`, {
    mount(b, close) {
      b.addEventListener("click", (e) => {
        const x = e.target.closest("[data-ch]"); if (x) { ch = x.dataset.ch; b.querySelectorAll("[data-ch]").forEach((y) => y.setAttribute("aria-checked", y === x)); }
        if (e.target.closest("[data-send]")) {
          state().crm.sent.unshift({ title: c ? c.title : "Personal offer", n: list.length, ch, at: Date.now() }); emit("crm");
          close(); toast(t("Sent to {n} by {ch}", { n: digits(list.length), ch: t(ch) }));
        }
      });
      b.querySelector("[data-msg]").addEventListener("input", (e) => (b.querySelector("[data-prev]").textContent = e.target.value));
    },
  });
}

export default {
  id: "crm",
  title: () => t("CRM"),
  render(params) {
    if (params.tab) tab = params.tab;
    return `
<section class="pad page-h crm-h">
  <div class="hello-top">${label(t("ENSO team"))}<span class="cap">${dateLabel(Date.now())}</span></div>
  <h1 class="h-big">${t("The book.")}</h1>
  <p class="lede">${t("Everyone who sits in the circle, what they order, and what's on the counter now.")}</p>
</section>
<nav class="tabs pad" role="tablist">${TABS.map(([id, s]) => `<button type="button" role="tab" class="${tab === id ? "on" : ""}" aria-selected="${tab === id}" data-act="tab" data-id="${id}">${t(s)}</button>`).join("")}<span class="tab-ink"></span></nav>
<div class="pad crm-body" id="crmb">${({ today, customers, gatherings, campaigns })[tab]()}</div>
<p class="pad demo-note">${ring({ size: 14 })}${t("Sample book for the preview — your own orders and requests from this phone appear live.")}</p>`;
  },
  mount(el, _p, rerender) {
    const body = () => el.querySelector("#crmb");
    const ink = () => { const on = el.querySelector(".tabs .on"), i = el.querySelector(".tab-ink"); if (on && i) { i.style.width = on.offsetWidth + "px"; i.style.transform = `translateX(${on.offsetLeft}px)`; } };
    requestAnimationFrame(ink);
    const paint = () => { body().innerHTML = ({ today, customers, gatherings, campaigns })[tab](); };
    el.addEventListener("click", (e) => {
      const a = e.target.closest("[data-act]"); if (!a) return;
      const id = a.dataset.id;
      if (a.dataset.act === "tab") { tab = id; el.querySelectorAll(".tabs button").forEach((b) => { b.classList.toggle("on", b === a); b.setAttribute("aria-selected", b === a); }); ink(); paint(); }
      if (a.dataset.act === "seg") { seg = id; paint(); }
      if (a.dataset.act === "cust") custSheet(id);
      if (a.dataset.act === "camp") compose({ key: id });
      if (a.dataset.act === "gmove") { moveGathering(id, +a.dataset.to); paint(); toast(t("Moved to {s}", { s: t(G_STAGES[+a.dataset.to]) })); }
      if (a.dataset.act === "adv") {
        const code = +id;
        if (a.dataset.live === "1") { const o = state().orders.find((o) => o.code === code); o.manual = true; advance(code); }
        else { const m = state().crm.moved; const cur = m["q" + code] ?? QUEUE.find((x) => x.code === code).stage; m["q" + code] = cur + 1; emit("crm"); }
        paint();
      }
    });
    el.addEventListener("input", (e) => { if (e.target.id === "cq") { q = e.target.value; el.querySelector("#clist").innerHTML = custList(); } });
    addEventListener("resize", ink);
    return () => removeEventListener("resize", ink);
  },
};
