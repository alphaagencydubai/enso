// Two languages, one switch. English lines in the code are the keys; FA holds the
// Persian. Numbers, prices and dates follow the language: Persian digits, Toman
// with a Persian thousands mark, and the Jalali calendar in Persian.
import { FA } from "./fa.js";

const KEY = "enso.v1.lang";
export let lang = (() => { try { return localStorage.getItem(KEY) === "fa" ? "fa" : "en"; } catch (e) { return "en"; } })();
const subs = new Set();

export function setLang(l) {
  lang = l === "fa" ? "fa" : "en";
  try { localStorage.setItem(KEY, lang); } catch (e) {}
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === "fa" ? "rtl" : "ltr";
  subs.forEach((f) => f(lang));
}
export const onLang = (f) => subs.add(f);
export const isFa = () => lang === "fa";

const missing = new Set();
export function t(s, vars) {
  let out = s;
  if (lang === "fa") {
    if (FA[s] != null) out = FA[s];
    else if (!missing.has(s)) { missing.add(s); console.warn("[fa] missing:", s); }
  }
  if (vars) out = out.replace(/\{(\w+)\}/g, (_, k) => (vars[k] != null ? vars[k] : ""));
  return out;
}
// a {en, fa} object, or a key-pair on an object (name → en/fa, desc → den/dfa)
export const L = (o, k) => {
  if (!o) return "";
  if (k) return lang === "fa" ? (o[k === "en" ? "fa" : "d" + "fa"] ?? o[k]) : o[k];
  return lang === "fa" ? (o.fa ?? o.en) : o.en;
};
export const D = (o) => (lang === "fa" ? o.dfa || o.den : o.den);

const FD = "۰۱۲۳۴۵۶۷۸۹";
export const digits = (s) => (lang === "fa" ? String(s).replace(/\d/g, (d) => FD[d]) : String(s));
export function num(n) {
  const s = Math.round(n).toLocaleString("en-US");
  return lang === "fa" ? digits(s).replace(/,/g, "٬") : s;
}
export const pct = (n) => (lang === "fa" ? digits(n) + "٪" : n + "%");
export const money = (n) => (lang === "fa" ? `${num(n)} تومان` : `${num(n)} T`);
export const moneyShort = (n) => {
  if (n >= 1e9) return lang === "fa" ? `${digits((n / 1e9).toFixed(1).replace(/\.0$/, ""))} میلیارد` : `${(n / 1e9).toFixed(1).replace(/\.0$/, "")}B T`;
  if (n >= 1e6) return lang === "fa" ? `${digits((n / 1e6).toFixed(1).replace(/\.0$/, "")).replace(".", "٫")} میلیون` : `${(n / 1e6).toFixed(1).replace(/\.0$/, "")}M T`;
  return money(n);
};

// ---- Jalali ----
export function toJalali(gy, gm, gd) {
  const g_d_m = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
  let jy = gy <= 1600 ? 0 : 979;
  gy -= gy <= 1600 ? 621 : 1600;
  const gy2 = gm > 2 ? gy + 1 : gy;
  let days = 365 * gy + Math.floor((gy2 + 3) / 4) - Math.floor((gy2 + 99) / 100) + Math.floor((gy2 + 399) / 400) - 80 + gd + g_d_m[gm - 1];
  jy += 33 * Math.floor(days / 12053); days %= 12053;
  jy += 4 * Math.floor(days / 1461); days %= 1461;
  if (days > 365) { jy += Math.floor((days - 1) / 365); days = (days - 1) % 365; }
  const jm = days < 186 ? 1 + Math.floor(days / 31) : 7 + Math.floor((days - 186) / 30);
  const jd = 1 + (days < 186 ? days % 31 : (days - 186) % 30);
  return [jy, jm, jd];
}
const JM = ["فروردین", "اردیبهشت", "خرداد", "تیر", "مرداد", "شهریور", "مهر", "آبان", "آذر", "دی", "بهمن", "اسفند"];
const WD_FA = ["یکشنبه", "دوشنبه", "سه‌شنبه", "چهارشنبه", "پنجشنبه", "جمعه", "شنبه"];
const WD_EN = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MO_EN = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export function dateLabel(d, { weekday = true, year = false } = {}) {
  d = new Date(d);
  if (lang === "fa") {
    const [jy, jm, jd] = toJalali(d.getFullYear(), d.getMonth() + 1, d.getDate());
    return `${weekday ? WD_FA[d.getDay()] + " " : ""}${digits(jd)} ${JM[jm - 1]}${year ? " " + digits(jy) : ""}`;
  }
  return `${weekday ? WD_EN[d.getDay()] + " " : ""}${d.getDate()} ${MO_EN[d.getMonth()]}${year ? " " + d.getFullYear() : ""}`;
}
export const weekday = (d) => (lang === "fa" ? WD_FA[new Date(d).getDay()] : WD_EN[new Date(d).getDay()]);
export const dayNum = (d) => {
  d = new Date(d);
  return lang === "fa" ? digits(toJalali(d.getFullYear(), d.getMonth() + 1, d.getDate())[2]) : String(d.getDate());
};
export const clock = (h, m = 0) => digits(`${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`);
export function ago(days) {
  if (days <= 0) return t("Today");
  if (days === 1) return t("Yesterday");
  if (days < 30) return t("{n} days ago", { n: digits(days) });
  return t("{n} months ago", { n: digits(Math.round(days / 30)) });
}
