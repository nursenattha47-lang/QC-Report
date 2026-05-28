/* Shared constants — fruit LOT codes + 6-round metadata. Lifted from source/qc_anjali_original.html */

const LOT_CODES = [
  { code: "B", name: "สับปะรด", emoji: "🍍" },
  { code: "C", name: "มะละกอ",   emoji: "🫒" },
  { code: "D", name: "มะม่วง",   emoji: "🥭" },
  { code: "E", name: "ลิ้นจี่",   emoji: "🍈" },
  { code: "F", name: "ลำไย",     emoji: "🍇" },
  { code: "G", name: "มะขาม",    emoji: "🟫" },
  { code: "H", name: "กล้วย",    emoji: "🍌" },
  { code: "J", name: "ส้ม",      emoji: "🍊" },
  { code: "K", name: "องุ่น",    emoji: "🍇" },
  { code: "L", name: "แตงโม",    emoji: "🍉" },
];

const ROUNDS = [
  { k: "m1", lb: "รอบ1 เช้า",  ic: "🌅", cl: "#245233" },
  { k: "m2", lb: "รอบ2 เช้า",  ic: "🌤️", cl: "#1565c0" },
  { k: "m3", lb: "รอบ3 เช้า",  ic: "☀️",  cl: "#b45309" },
  { k: "a1", lb: "รอบ1 บ่าย", ic: "🌞",  cl: "#6a1b9a" },
  { k: "a2", lb: "รอบ2 บ่าย", ic: "🌇",  cl: "#7b3f00" },
  { k: "a3", lb: "รอบ3 เย็น",  ic: "🌆",  cl: "#2e4a5a" },
];

function pad(n) { return n < 10 ? "0" + n : "" + n; }
function nowHM() { const d = new Date(); return pad(d.getHours()) + ":" + pad(d.getMinutes()); }
function todayISO() { const d = new Date(); return d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate()); }

Object.assign(window, { LOT_CODES, ROUNDS, pad, nowHM, todayISO });
