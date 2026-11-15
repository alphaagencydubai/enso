// The CRM's book: a seeded, made-up set of regulars so the back office has a week
// of life in it. Nothing here is ENSO's real data. The same seed gives the same
// people on every phone; the guest's own orders and requests are mixed in live.
import { MENU } from "./data.js";

function rng(seed) { return () => ((seed = (seed * 1664525 + 1013904223) % 4294967296) / 4294967296); }
const R = rng(20261115);
const pick = (a) => a[Math.floor(R() * a.length)];

const FIRST = [["سارا", "Sara"], ["مریم", "Maryam"], ["علی", "Ali"], ["رضا", "Reza"], ["نیلوفر", "Niloufar"], ["آیدا", "Aida"], ["امیر", "Amir"], ["الناز", "Elnaz"], ["پارسا", "Parsa"], ["تینا", "Tina"], ["سینا", "Sina"], ["یاسمن", "Yasaman"], ["مهسا", "Mahsa"], ["آرمان", "Arman"], ["نگار", "Negar"], ["بهار", "Bahar"], ["کیان", "Kian"], ["ترانه", "Taraneh"], ["شیوا", "Shiva"], ["لیلا", "Leila"], ["آیسان", "Aysan"], ["ایلگار", "Ilgar"], ["آیلین", "Aylin"], ["یاشار", "Yashar"], ["آرین", "Arin"], ["سولماز", "Solmaz"], ["توحید", "Tohid"], ["گلناز", "Golnaz"], ["سانای", "Sanay"], ["دلارام", "Delaram"]];
const LAST = [["رضایی", "Rezaei"], ["محمدی", "Mohammadi"], ["حسینی", "Hosseini"], ["نوری", "Nouri"], ["اکبری", "Akbari"], ["قاسمی", "Ghasemi"], ["جعفری", "Jafari"], ["صادقی", "Sadeghi"], ["کریمی", "Karimi"], ["عباسی", "Abbasi"], ["تقوی", "Taghavi"], ["نجفی", "Najafi"], ["باقری", "Bagheri"], ["زمانی", "Zamani"], ["فتحی", "Fathi"]];
const FAVS = ["ny-pistachio", "coldbrew", "croissant", "spanish", "twist", "pina", "latte", "sansebastian", "cube", "nest-egg", "ny-lotus", "pistachio-latte"];

const today = new Date(); today.setHours(0, 0, 0, 0);
export const CUSTOMERS = Array.from({ length: 48 }, (_, i) => {
  const f = FIRST[i % FIRST.length], l = pick(LAST);
  const visits = Math.max(1, Math.round(Math.pow(R(), 2.2) * 60));
  const avg = 180000 + Math.round(R() * 42) * 10000;
  const last = visits > 30 ? Math.floor(R() * 6) : Math.floor(Math.pow(R(), 1.6) * 75);
  const bd = new Date(today); bd.setDate(bd.getDate() + Math.floor(R() * 120) - 20);
  const since = new Date(today); since.setDate(since.getDate() - (60 + Math.floor(R() * 420)));
  const tags = [];
  if (visits >= 30) tags.push("Regular");
  if (visits * avg > 9e6) tags.push("VIP");
  if (visits <= 2) tags.push("New");
  if (R() < 0.18) tags.push("Gatherings");
  if (R() < 0.2) tags.push("Oat milk");
  return {
    id: "c" + (i + 1), fa: `${f[0]} ${l[0]}`, en: `${f[1]} ${l[1]}`,
    phone: `0914 ${String(100 + Math.floor(R() * 899))} ${String(10 + Math.floor(R() * 89))} ${String(10 + Math.floor(R() * 89))}`,
    visits, spend: visits * avg, avg, last, birthday: bd.toISOString(), since: since.toISOString(),
    fav: pick(FAVS), tags, stamps: visits % 10,
  };
}).sort((a, b) => b.spend - a.spend);

// a week of takings, today partly through
export const WEEK = Array.from({ length: 7 }, (_, i) => {
  const d = new Date(today); d.setDate(d.getDate() - 6 + i);
  const base = [38, 41, 36, 44, 58, 71, 52][d.getDay()] * 1e6;
  return { d: d.toISOString(), rev: Math.round(base * (0.85 + R() * 0.3) / 1e5) * 1e5, orders: Math.round(base / 260000 * (0.9 + R() * 0.2)) };
});
{ const h = new Date().getHours(); const share = Math.min(1, Math.max(0.08, (h - 8) / 15)); WEEK[6].rev = Math.round(WEEK[6].rev * share / 1e5) * 1e5; WEEK[6].orders = Math.max(4, Math.round(WEEK[6].orders * share)); }

export const TOP = ["ny-pistachio", "croissant", "spanish", "coldbrew", "twist", "pina"].map((id, i) => ({ id, n: [184, 151, 139, 97, 88, 64][i] }));

// counter orders already in the queue today (the guest's own go on top)
export const QUEUE = [
  { code: 214, who: "c3", lines: [["latte", 2], ["croissant", 2]], stage: 1, min: 4, mode: "table", table: 6 },
  { code: 213, who: "c11", lines: [["coldbrew", 1], ["ny-pistachio", 1]], stage: 1, min: 6, mode: "pickup" },
  { code: 212, who: "c7", lines: [["spanish", 1]], stage: 2, min: 0, mode: "pickup" },
  { code: 211, who: "c19", lines: [["nest-egg", 2], ["americano", 2]], stage: 2, min: 0, mode: "table", table: 2 },
];

const dAhead = (n) => { const d = new Date(today); d.setDate(d.getDate() + n); return d.toISOString(); };
export const GATHER_SEED = [
  { code: "G-1388", who: "c2", occasion: "wedding", guests: 220, day: dAhead(6), time: 18, total: 68400000, pieces: 520, status: 2, set: "sweet" },
  { code: "G-1391", who: "c14", occasion: "office", guests: 60, day: dAhead(2), time: 10, total: 14250000, pieces: 150, status: 1, set: "office" },
  { code: "G-1395", who: "c9", occasion: "birthday", guests: 35, day: dAhead(1), time: 17, total: 7920000, pieces: 84, status: 3, set: "morning" },
  { code: "G-1397", who: "c23", occasion: "memorial", guests: 120, day: dAhead(3), time: 16, total: 21600000, pieces: 264, status: 0, set: "quiet" },
  { code: "G-1379", who: "c5", occasion: "graduation", guests: 48, day: dAhead(-2), time: 19, total: 9840000, pieces: 108, status: 4, set: "sweet" },
];

export const custById = (id) => CUSTOMERS.find((c) => c.id === id);
export const menuIds = MENU.map((m) => m.id);
