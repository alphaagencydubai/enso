import { byId, ENSO, OCCASIONS } from "../data.js";
import { t, L, money, digits, dateLabel, clock, lang, setLang } from "../i18n.js";
import { ICON, photo, esc, label, ring, toast, sheet } from "../ui.js";
import { state, emit, reset, STAGES, G_STAGES, liveOrder, advance } from "../store.js";
import { canInstall, install } from "../install.js";

const stageLabel = ["Received", "In the oven", "Ready at the counter", "Collected"];

function liveBlock(o) {
  if (!o) return "";
  const mins = Math.max(0, Math.ceil((o.eta - Date.now()) / 60000));
  return `<section class="pad block"><div class="livebox">
    <div class="lb-top">${ring({ size: 46, fill: o.stage + 1 })}<div><small class="cap">${t("Order")} ${digits(o.code)}</small><b>${t(stageLabel[o.stage])}</b><small>${o.stage < 2 ? t("About {m} min", { m: digits(mins || 1) }) : t("Show the number at the counter")}</small></div></div>
    <ol class="track">${stageLabel.slice(0, 3).map((s, i) => `<li class="${i <= o.stage ? "on" : ""}"><i></i><span>${t(s)}</span></li>`).join("")}</ol>
    ${o.stage === 2 ? `<button class="btn btn-white full" type="button" data-act="collected" data-id="${o.code}">${t("I've collected it")}</button>` : ""}
  </div></section>`;
}

function stamps(n) {
  return `<div class="stampcard">
    <div class="sc-top"><span>${label(t("Circle card"))}<b>${t("Every tenth coffee is on us.")}</b></span><img src="assets/brand/enso-word.svg" alt="" class="sc-word"></div>
    <div class="sc-grid">${Array.from({ length: 10 }, (_, i) => `<span class="st ${i < n ? "on" : ""}" style="--i:${i}">${ring({ size: 30 })}${i === 9 ? `<small>${t("Free")}</small>` : ""}</span>`).join("")}</div>
    <p class="sc-foot">${n >= 10 ? t("Your next coffee is free — show this at the counter.") : t("{n} of 10 · {m} to go", { n: digits(n), m: digits(10 - n) })}</p>
  </div>`;
}

export default {
  id: "profile",
  title: () => t("Profile"),
  render() {
    const S = state(), p = S.profile;
    const live = liveOrder();
    const past = S.orders.filter((o) => o !== live).slice(0, 6);
    return `
<section class="pad page-h">
  ${label(t("Your circle"))}
  <h1 class="h-big">${p.name ? esc(p.name.split(" ")[0]) + "." : t("Welcome.")}</h1>
  ${p.name ? `<p class="lede">${t("Member since {d}", { d: dateLabel(p.since, { weekday: false, year: true }) })}${p.phone ? ` · <span dir="ltr">${digits(esc(p.phone))}</span>` : ""}</p>` : `
  <p class="lede">${t("Join the circle: a stamp for every coffee, your orders and gatherings in one place.")}</p>
  <form class="join" id="join">
    <label class="field"><span>${t("Name")}</span><input name="name" required autocomplete="name" placeholder="${t("Your name")}"></label>
    <label class="field"><span>${t("Mobile")}</span><input name="phone" type="tel" inputmode="tel" dir="ltr" required autocomplete="tel" placeholder="0914 ••• •• ••"></label>
    <label class="field"><span>${t("Birthday · optional, for a treat")}</span><input name="birthday" type="date"></label>
    <button class="btn btn-ink full" type="submit">${t("Join the circle")}</button>
  </form>`}
</section>

${liveBlock(live)}

<section class="pad block">${stamps(S.stamps)}</section>

<section class="pad block">
  <div class="block-h">${label(t("Saved"))}<a class="more" href="#/menu">${t("Menu")}</a></div>
  ${S.favs.length ? `<div class="favs">${S.favs.map((id) => { const m = byId(id); return m ? `<a href="#/menu?item=${id}" class="fav-c">${photo(m.img, "fav-ph", true, L(m))}<b>${esc(L(m))}</b><small>${money(m.price)}</small></a>` : ""; }).join("")}</div>` : `<p class="hint">${t("Tap the heart on anything you love.")}</p>`}
</section>

<section class="pad block">
  <div class="block-h">${label(t("Gatherings"))}<a class="more" href="#/gather">${t("Plan one")}</a></div>
  ${S.gatherings.length ? `<ul class="list">${S.gatherings.map((r) => `<li class="req"><span class="req-ring">${ring({ size: 30, fill: Math.min(3, r.status + 1) })}</span><span class="row-t"><b>${esc(L(OCCASIONS.find((o) => o.id === r.occasion)))} · ${digits(r.guests)} ${t("guests")}</b><small>${dateLabel(r.day)} · ${clock(r.time)} · ${money(r.total)}</small></span><span class="badge s${r.status}">${t(G_STAGES[r.status])}</span></li>`).join("")}</ul>` : `<p class="hint">${t("Birthdays, weddings, the office — boxes from 12 to 500 pieces.")}</p>`}
</section>

<section class="pad block">
  <div class="block-h">${label(t("Orders"))}</div>
  ${past.length ? `<ul class="list">${past.map((o) => `<li class="ord"><span class="row-t"><b>${o.lines.map((l) => `${digits(l.qty)}× ${esc(L(byId(l.id)))}`).join("، ")}</b><small>${dateLabel(o.at)} · ${digits(o.code)}</small></span><span class="row-p">${money(o.total)}</span><button class="again" type="button" data-act="again" data-id="${o.code}">${t("Again")}</button></li>`).join("")}</ul>` : `<p class="hint">${t("Your orders will show here.")}</p>`}
</section>

<section class="pad block settings">
  ${label(t("Settings"))}
  <div class="set-row"><span>${ICON.globe}<b>${t("Language")}</b></span><div class="seg mini" role="radiogroup"><button type="button" role="radio" data-act="lang" data-id="en" aria-checked="${lang === "en"}">English</button><button type="button" role="radio" data-act="lang" data-id="fa" aria-checked="${lang === "fa"}">فارسی</button></div></div>
  ${canInstall() ? `<button class="set-row" type="button" data-act="install"><span>${ICON.download}<b>${t("Add ENSO to your Home Screen")}</b></span>${ICON.chev}</button>` : ""}
  <a class="set-row" href="#/crm"><span>${ICON.crm}<b>${t("ENSO team · CRM")}</b></span>${ICON.chev}</a>
  <a class="set-row" href="https://instagram.com/${ENSO.instagram}" target="_blank" rel="noopener"><span>${ICON.insta}<b>@${ENSO.instagram}</b></span>${ICON.chev}</a>
  <a class="set-row" href="tel:${ENSO.phone}"><span>${ICON.phone}<b dir="ltr">${digits(ENSO.phoneShow)}</b></span>${ICON.chev}</a>
  ${p.name ? `<button class="set-row danger" type="button" data-act="reset"><span>${ICON.trash}<b>${t("Sign out and clear this phone")}</b></span></button>` : ""}
</section>`;
  },
  mount(el, _p, rerender) {
    el.querySelector("#join")?.addEventListener("submit", (e) => {
      e.preventDefault();
      const f = new FormData(e.target), p = state().profile;
      p.name = f.get("name").trim(); p.phone = f.get("phone").trim(); p.birthday = f.get("birthday"); p.since = Date.now();
      emit("profile"); toast(t("Welcome to the circle, {n}", { n: esc(p.name.split(" ")[0]) })); rerender();
    });
    el.addEventListener("click", (e) => {
      const a = e.target.closest("[data-act]"); if (!a) return;
      if (a.dataset.act === "lang") setLang(a.dataset.id);
      if (a.dataset.act === "install") install();
      if (a.dataset.act === "collected") { advance(+a.dataset.id, 3); rerender(); }
      if (a.dataset.act === "again") {
        const o = state().orders.find((o) => o.code === +a.dataset.id);
        o.lines.forEach((l) => { const S = state(); const ex = S.bag.find((x) => x.key === l.key); if (ex) ex.qty += l.qty; else S.bag.push({ key: l.key, id: l.id, qty: l.qty, opts: l.opts, note: l.note }); });
        emit("bag"); toast(t("Back in your bag"));
      }
      if (a.dataset.act === "reset") {
        sheet(`<div class="confirm">${label(t("Sign out"))}<h2 class="h-mid">${t("Clear your bag, orders and stamps from this phone?")}</h2><button class="btn btn-ink full" data-yes type="button">${t("Clear everything")}</button><button class="btn btn-line full" data-x type="button">${t("Keep it")}</button></div>`, {
          mount(b, close) { b.querySelector("[data-yes]").addEventListener("click", () => { reset(); close(); rerender(); }); },
        });
      }
    });
  },
  live: true, // re-render when an order moves
};
