// All on-screen text comes from ko.json / en.json. Device language decides the default;
// anything other than Korean falls back to English.
import ko from './ko.json';
import en from './en.json';

const TABLES = { ko, en };
let lang = 'en';

export function detectLanguage() {
  const list = (navigator.languages && navigator.languages.length ? navigator.languages : [navigator.language || 'en']);
  for (const l of list) {
    const code = String(l).toLowerCase().slice(0, 2);
    if (TABLES[code]) return code;
  }
  return 'en';
}

export function setLanguage(l) {
  lang = TABLES[l] ? l : 'en';
  document.documentElement.lang = lang;
}

export function getLanguage() { return lang; }

export function t(key, vars) {
  let s = TABLES[lang][key];
  if (s === undefined) s = TABLES.en[key];
  if (s === undefined) return key;
  if (vars) s = s.replace(/\{(\w+)\}/g, (m, k) => (vars[k] !== undefined ? fmtVar(vars[k]) : m));
  return s;
}

function fmtVar(v) {
  return typeof v === 'number' ? formatNumber(v) : v;
}

export function formatNumber(n) {
  const v = Math.round(n);
  try { return v.toLocaleString(lang === 'ko' ? 'ko-KR' : 'en-US'); } catch (e) { return String(v); }
}

export function name(obj) {
  if (!obj) return '';
  return obj[lang] || obj.en || '';
}

export const LANGS = ['ko', 'en'];
