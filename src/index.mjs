// @bareche/fechas — JavaScript puro (ESM)

/** Devuelve un clon de Date a partir de Date/string/number */
export function toDate(input) {
  if (input instanceof Date) return new Date(input.getTime());
  if (typeof input === "string" || typeof input === "number")
    return new Date(input);
  return new Date(input);
}

export function now() {
  return new Date();
}

export function isValid(input) {
  const d = input instanceof Date ? input : toDate(input);
  return d instanceof Date && !Number.isNaN(d.getTime());
}

export function parseISO(iso) {
  if (typeof iso !== "string") return null;
  const d = new Date(iso);
  return isValid(d) ? d : null;
}

// ---- format con tokens básicos: YYYY, MM, DD, HH, mm, ss
function pad(n, len = 2) {
  return String(n).padStart(len, "0");
}

export function format(dateInput, pattern) {
  const d = toDate(dateInput);
  if (!isValid(d)) throw new Error("Invalid date");

  const YYYY = d.getFullYear();
  const MM = pad(d.getMonth() + 1);
  const DD = pad(d.getDate());
  const HH = pad(d.getHours());
  const mm = pad(d.getMinutes());
  const ss = pad(d.getSeconds());

  return pattern
    .replace(/YYYY/g, String(YYYY))
    .replace(/MM/g, MM)
    .replace(/DD/g, DD)
    .replace(/HH/g, HH)
    .replace(/mm/g, mm)
    .replace(/ss/g, ss);
}

// ---- suma/resta
export function add(dateInput, dur = {}) {
  const d = toDate(dateInput);
  if (!isValid(d)) throw new Error("Invalid date");
  const out = new Date(d.getTime());

  if (dur.years) out.setFullYear(out.getFullYear() + dur.years);
  if (dur.months) out.setMonth(out.getMonth() + dur.months);
  if (dur.days) out.setDate(out.getDate() + dur.days);
  if (dur.hours) out.setHours(out.getHours() + dur.hours);
  if (dur.minutes) out.setMinutes(out.getMinutes() + dur.minutes);
  if (dur.seconds) out.setSeconds(out.getSeconds() + dur.seconds);
  if (dur.ms) out.setMilliseconds(out.getMilliseconds() + dur.ms);

  return out;
}

export function sub(dateInput, dur = {}) {
  const neg = {};
  for (const k in dur) neg[k] = -(dur[k] ?? 0);
  return add(dateInput, neg);
}

// ---- comparación y diferencia
export function diff(a, b, unit = "ms") {
  const ms = toDate(a).getTime() - toDate(b).getTime();
  if (unit === "ms") return ms;
  if (unit === "s") return ms / 1e3;
  if (unit === "m") return ms / 6e4;
  if (unit === "h") return ms / 3.6e6;
  if (unit === "d") return ms / 8.64e7;
  return ms;
}

export const isBefore = (a, b) => toDate(a).getTime() < toDate(b).getTime();
export const isAfter = (a, b) => toDate(a).getTime() > toDate(b).getTime();
export const isEqual = (a, b) => toDate(a).getTime() === toDate(b).getTime();

// ---- startOf / endOf
export function startOf(dateInput, unit) {
  const d = toDate(dateInput);
  switch (unit) {
    case "year":
      return new Date(d.getFullYear(), 0, 1, 0, 0, 0, 0);
    case "month":
      return new Date(d.getFullYear(), d.getMonth(), 1, 0, 0, 0, 0);
    case "week": {
      // Semana ISO: lunes como inicio
      const wd = (d.getDay() + 6) % 7; // 0..6 con 0=lunes
      const res = new Date(d);
      res.setHours(0, 0, 0, 0);
      res.setDate(res.getDate() - wd);
      return res;
    }
    case "day":
      return new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0, 0);
    case "hour":
      return new Date(
        d.getFullYear(),
        d.getMonth(),
        d.getDate(),
        d.getHours(),
        0,
        0,
        0
      );
    case "minute":
      return new Date(
        d.getFullYear(),
        d.getMonth(),
        d.getDate(),
        d.getHours(),
        d.getMinutes(),
        0,
        0
      );
    case "second":
      return new Date(
        d.getFullYear(),
        d.getMonth(),
        d.getDate(),
        d.getHours(),
        d.getMinutes(),
        d.getSeconds(),
        0
      );
    default:
      throw new Error("Unsupported unit");
  }
}

export function endOf(dateInput, unit) {
  const d = toDate(dateInput);
  let next;
  switch (unit) {
    case "year":
      next = new Date(d.getFullYear() + 1, 0, 1);
      break;
    case "month":
      next = new Date(d.getFullYear(), d.getMonth() + 1, 1);
      break;
    case "week":
      next = add(startOf(d, "week"), { days: 7 });
      break;
    case "day":
      next = add(startOf(d, "day"), { days: 1 });
      break;
    case "hour":
      next = add(startOf(d, "hour"), { hours: 1 });
      break;
    case "minute":
      next = add(startOf(d, "minute"), { minutes: 1 });
      break;
    case "second":
      next = add(startOf(d, "second"), { seconds: 1 });
      break;
    default:
      throw new Error("Unsupported unit");
  }
  return new Date(next.getTime() - 1);
}

// ---- número de semana ISO-8601
export function weekOfYear(dateInput) {
  const d = toDate(dateInput);
  const utc = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const day = utc.getUTCDay() || 7; // 1..7, domingo=7
  utc.setUTCDate(utc.getUTCDate() + 4 - day); // al jueves de la semana
  const yearStart = new Date(Date.UTC(utc.getUTCFullYear(), 0, 1));
  return Math.ceil(((utc - yearStart) / 86400000 + 1) / 7);
}

export function clamp(dateInput, min, max) {
  const t = toDate(dateInput).getTime();
  const tMin = toDate(min).getTime();
  const tMax = toDate(max).getTime();
  if (t < tMin) return new Date(tMin);
  if (t > tMax) return new Date(tMax);
  return new Date(t);
}

// ---- “hace X / en X” (ES básico)
export function relativeTime(to, from = now()) {
  const ms = diff(to, from, "ms");
  const abs = Math.abs(ms);
  const s = Math.round(abs / 1e3);
  const m = Math.round(abs / 6e4);
  const h = Math.round(abs / 3.6e6);
  const d = Math.round(abs / 8.64e7);
  const future = ms > 0;
  const fmt = (n, u) => (future ? `en ${n} ${u}` : `hace ${n} ${u}`);

  if (s < 10) return future ? "en instantes" : "justo ahora";
  if (s < 60) return fmt(s, "seg");
  if (m < 60) return fmt(m, "min");
  if (h < 24) return fmt(h, "h");
  return fmt(d, d === 1 ? "día" : "días");
}
