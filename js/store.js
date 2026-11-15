// Everything the guest does stays on the phone: the bag, orders, gathering
// requests, the profile and the stamp card. The CRM reads the same store plus a
// seeded book of regulars, so an order placed here shows up there at once.
import { byId, PIECES, TIERS, BOX, DELIVERY, DEPOSIT } from "./data.js";

const KEY = "enso.v1.state";
const blank = () => ({
  bag: [],            // {key, id, qty, opts:{group:choice}, note}
  orders: [],         // {code, at, lines, total, mode, status, eta}
  gatherings: [],     // {code, at, ...form, total, deposit, status}
  profile: { name: "", phone: "", birthday: "", since: Date.now() },
  stamps: 3,
  favs: ["ny-pistachio", "coldbrew"],
  crm: { moved: {}, notes: {}, sent: [] },
});

let S;
try { S = Object.assign(blank(), JSON.parse(localStorage.getItem(KEY) || "{}")); } catch (e) { S = blank(); }
const subs = new Set();
const save = () => { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {} };
export const state = () => S;
export const on = (f) => (subs.add(f), () => subs.delete(f));
export function emit(what) { save(); subs.forEach((f) => f(what)); }
export function reset() { S = blank(); emit("all"); }

// ---- bag ----
export function linePrice(l) {
  const it = byId(l.id); if (!it) return 0;
  let p = it.price;
  (it.opts || []).forEach((g) => { const c = g.choices.find((c) => c.id === l.opts?.[g.id]); if (c?.add) p += c.add; });
  return p;
}
export const bagCount = () => S.bag.reduce((a, l) => a + l.qty, 0);
export const bagTotal = () => S.bag.reduce((a, l) => a + linePrice(l) * l.qty, 0);
export function addToBag(id, qty = 1, opts = {}, note = "") {
  const key = id + "|" + JSON.stringify(opts) + "|" + note;
  const ex = S.bag.find((l) => l.key === key);
  if (ex) ex.qty += qty; else S.bag.push({ key, id, qty, opts, note });
  emit("bag");
}
export function setQty(key, qty) {
  const l = S.bag.find((l) => l.key === key); if (!l) return;
  l.qty = qty; if (qty <= 0) S.bag = S.bag.filter((x) => x !== l);
  emit("bag");
}

// ---- orders: a live activity the island shows until it's collected ----
export const STAGES = ["Received", "In the oven", "Ready", "Collected"];
export function placeOrder(mode, when) {
  const code = 200 + Math.floor(Math.random() * 99);
  const o = { code, at: Date.now(), lines: S.bag.map((l) => ({ ...l, price: linePrice(l) })), total: bagTotal(),
    mode, when, stage: 0, eta: Date.now() + 6 * 60000 };
  S.orders.unshift(o); S.bag = [];
  S.stamps = Math.min(10, S.stamps + o.lines.filter((l) => byId(l.id)?.cat === "coffee" || byId(l.id)?.cat === "cold").reduce((a, l) => a + l.qty, 0));
  emit("order");
  return o;
}
export const liveOrder = () => S.orders.find((o) => o.stage < 3 && Date.now() - o.at < 3 * 3600e3);
export function advance(code, to) {
  const o = S.orders.find((o) => o.code === code); if (!o) return;
  o.stage = to ?? Math.min(3, o.stage + 1);
  if (o.stage >= 2) o.eta = Date.now();
  emit("order");
}
// the demo moves an order along by itself: received → oven after 20 s → ready after 90 s
export function tick() {
  let changed = false;
  S.orders.forEach((o) => {
    if (o.manual) return;
    const age = (Date.now() - o.at) / 1000;
    const want = age > 90 ? 2 : age > 20 ? 1 : 0;
    if (o.stage < 2 && want > o.stage) { o.stage = want; if (want === 2) o.eta = Date.now(); changed = true; }
  });
  if (changed) emit("order");
}

// ---- gatherings ----
export function quote(g) {
  const lines = Object.entries(g.items || {}).filter(([, q]) => q > 0).map(([id, q]) => {
    const p = PIECES.find((p) => p.id === id); return { id, qty: q, price: p.price, sum: p.price * q };
  });
  // a coffee box serves ten, a whole cheesecake twelve; everything else is one piece
  const pieces = lines.reduce((a, l) => a + l.qty * (l.id === "g-coffeebox" ? 10 : l.id === "g-sansebastian" ? 12 : 1), 0);
  const sub = lines.reduce((a, l) => a + l.sum, 0);
  const tier = TIERS.find((t) => pieces >= t.min);
  const off = tier ? Math.round(sub * tier.off) : 0;
  const boxes = g.boxes ? Math.ceil(pieces / BOX.holds) : 0;
  const box = boxes * BOX.price;
  const del = g.mode === "delivery" ? DELIVERY : 0;
  const total = sub - off + box + del;
  return { lines, pieces, sub, tier, off, boxes, box, del, total, deposit: Math.round(total * DEPOSIT / 10000) * 10000 };
}
export function requestGathering(g) {
  const q = quote(g);
  const code = "G-" + (1400 + S.gatherings.length * 7 + Math.floor(Math.random() * 6));
  const rec = { ...JSON.parse(JSON.stringify(g)), code, at: Date.now(), total: q.total, deposit: q.deposit, pieces: q.pieces, status: 0 };
  S.gatherings.unshift(rec);
  emit("gathering");
  return rec;
}
export const G_STAGES = ["Requested", "Confirmed", "Deposit paid", "Baking", "Delivered"];
export function moveGathering(code, to) {
  const g = S.gatherings.find((g) => g.code === code);
  if (g) g.status = to; else S.crm.moved[code] = to;
  emit("gathering");
}
