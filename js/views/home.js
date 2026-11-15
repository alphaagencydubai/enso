import { ENSO, MENU, byId } from "../data.js";
import { t, L, D, money, clock, isFa, digits } from "../i18n.js";
import { ICON, ring, photo, esc, label } from "../ui.js";
import { liveOrder, state } from "../store.js";

function greeting() {
  const h = new Date().getHours();
  return h < 12 ? t("Good morning.") : h < 17 ? t("Good afternoon.") : t("Good evening.");
}
export function openNow() {
  const h = new Date().getHours() + new Date().getMinutes() / 60;
  return h >= ENSO.open && h < ENSO.close;
}
function todayLine() {
  const h = new Date().getHours();
  if (!openNow()) return t("We open at {t}. The first croissants come out at {o}.", { t: clock(ENSO.open), o: clock(ENSO.ovenAt) });
  if (h < 11) return t("The croissants came out at {o}. The cold brew has been steeping since last night.", { o: clock(ENSO.ovenAt) });
  if (h < 17) return t("Second bake is out: twists, rolls and the cube. Coffee until {c}.", { c: clock(ENSO.close) });
  return t("The last of today's bake, and coffee until {c}.", { c: clock(ENSO.close) });
}

const card = (id, i) => {
  const m = byId(id);
  return `<a class="roll" href="#/menu?item=${m.id}" style="--i:${i}">
    ${photo({ src: m.img.src, pos: "50% 50%", zoom: 1 }, "roll-ph", true, L(m))}
    <span class="roll-n">${digits(String(i + 1).padStart(2, "0"))}</span>
    <b>${esc(L(m)).replace(/ New York roll| · bottle|رول نیویورکی /g, "")}</b>
    <small>${money(m.price)}</small></a>`;
};

export default {
  id: "home",
  title: () => t("Home"),
  render() {
    const pick = byId("ny-pistachio");
    const live = liveOrder();
    const open = openNow();
    return `
<section class="hello pad">
  <div class="hello-top">${label(t("Tabriz"))}<span class="status ${open ? "is-open" : ""}"><i class="dot"></i>${open ? t("Open until {c}", { c: clock(ENSO.close) }) : t("Closed · opens {o}", { o: clock(ENSO.open) })}</span></div>
  <h1 class="h-big">${greeting()}</h1>
  <p class="lede">${todayLine()}</p>
</section>

<figure class="film pad">
  <div class="film-frame">
    <video id="film" muted playsinline loop autoplay preload="metadata" poster="assets/video/poster.webp"><source src="assets/video/film.mp4" type="video/mp4"></video>
    <button class="film-ring" type="button" data-act="film" aria-label="${t("Pause the film")}">${ring({ size: 22, spin: true })}</button>
  </div>
  <figcaption class="cap-row"><span>${digits("01")} — ${t("The room")}</span><span>${t("Valiasr · Tabriz")}</span></figcaption>
</figure>

${live ? `<a class="live-card pad" href="#/profile"><span class="live-ring">${ring({ size: 34, fill: live.stage + 1 })}</span><span><small class="cap">${t("Your order")} · ${digits(live.code)}</small><b>${t(["Received", "In the oven", "Ready at the counter", "Collected"][live.stage])}</b></span>${ICON.chev}</a>` : ""}

<section class="pad">
  <div class="today">
    ${photo(pick.img, "today-ph", true, L(pick))}
    <div class="today-t">
      ${label(t("Today's pick"))}
      <h3>${esc(L(pick))}</h3>
      <p>${money(pick.price)}</p>
    </div>
    <button class="add-o" type="button" data-act="add" data-id="${pick.id}" aria-label="${t("Add {name} to your bag", { name: esc(L(pick)) })}">${ICON.plus}</button>
  </div>
</section>

<section class="block">
  <div class="block-h pad">${label(t("The New York rolls"))}<a class="more" href="#/menu?cat=rolls">${t("All")}</a></div>
  <h2 class="h-mid pad">${t("Three fillings,<br>one circle.")}</h2>
  <div class="rolls">${["ny-pistachio", "ny-nutella", "ny-lotus"].map(card).join("")}</div>
</section>

<section class="block pad">
  <div class="block-h">${label(t("From the oven"))}<a class="more" href="#/menu?cat=oven">${t("Menu")}</a></div>
  <ul class="list">
    ${["croissant", "twist", "cube", "swirl"].map((id) => { const m = byId(id); return `
    <li><a class="row" href="#/menu?item=${id}">${photo(m.img, "row-ph", true, L(m))}<span class="row-t"><b>${esc(L(m))}</b><small>${esc(D(m))}</small></span><span class="row-p">${money(m.price)}</span></a></li>`; }).join("")}
  </ul>
</section>

<section class="block pad">
  <a class="gather-card" href="#/gather">
    <span class="gc-ph">${photo({ src: "box", pos: "50% 50%", zoom: 1 }, "", false)}</span>
    <span class="gc-t">
      ${label(t("Ceremonies & parties"))}
      <b>${t("For the table everyone sits around.")}</b>
      <small>${t("Boxes of 12 to 500 pieces, packed in ENSO's circle.")}</small>
      <span class="btn btn-ink sm">${t("Plan a gathering")}</span>
    </span>
  </a>
</section>

<section class="quote">
  <span class="rings" aria-hidden="true"></span>
  ${ring({ size: 44 })}
  <p>${t("Enso is the circle drawn in one breath. We named the place after it — a table you come back to.")}</p>
  ${label(t("Circle of togetherness"))}
</section>

<section class="block pad">
  <div class="block-h">${label(t("On Instagram"))}<a class="more" href="https://instagram.com/${ENSO.instagram}" target="_blank" rel="noopener">@${ENSO.instagram}</a></div>
  <div class="mosaic">
    ${["rack", "cups", "egg", "layers", "trio", "comfort"].map((s, i) => `<a href="https://instagram.com/${ENSO.instagram}" target="_blank" rel="noopener" class="mo mo${i}">${photo({ src: s, pos: "50% 50%", zoom: 1 }, "", true)}</a>`).join("")}
  </div>
</section>

<section class="block pad visit">
  ${label(t("Visit"))}
  <h2 class="h-mid">${t("Opposite Ailar Alley.")}</h2>
  <p class="addr">${esc(L(ENSO.address))}</p>
  <div class="visit-row">
    <a class="btn btn-ink" href="${ENSO.map}" target="_blank" rel="noopener">${ICON.pin}<span>${t("Directions")}</span></a>
    <a class="btn btn-line" href="tel:${ENSO.phone}">${ICON.phone}<span dir="ltr">${digits(ENSO.phoneShow)}</span></a>
  </div>
  <dl class="facts">
    <div><dt>${t("Hours")}</dt><dd>${t("Every day")} · ${clock(ENSO.open)}–${clock(ENSO.close)}</dd></div>
    <div><dt>${t("Delivery")}</dt><dd><a href="${ENSO.snappfood}" target="_blank" rel="noopener">${t("On Snappfood")}</a></dd></div>
    <div><dt>${t("Gatherings")}</dt><dd><a href="#/gather">${t("24 hours' notice, 48 for 100+ guests")}</a></dd></div>
  </dl>
</section>
`;
  },
  mount(el) {
    const v = el.querySelector("#film");
    if (v) {
      const p = v.play(); if (p && p.catch) p.catch(() => {});
      el.querySelector("[data-act=film]").addEventListener("click", (e) => {
        e.stopPropagation();
        if (v.paused) { v.play(); e.currentTarget.classList.remove("paused"); } else { v.pause(); e.currentTarget.classList.add("paused"); }
      });
    }
  },
};
