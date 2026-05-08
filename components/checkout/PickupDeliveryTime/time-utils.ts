/** Generate hour-range strings from 08:00 to 18:00, e.g. "08:00-09:00" */
export const generateTimeRanges = (): string[] => {
  const ranges: string[] = [];
  for (let hour = 8; hour < 18; hour++) {
    const start = hour.toString().padStart(2, '0');
    const end = (hour + 1).toString().padStart(2, '0');
    ranges.push(`${start}:00-${end}:00`);
  }
  return ranges;
};

export const TIME_RANGES = generateTimeRanges();

/** Format a Date as YYYY-MM-DD using LOCAL date parts. */
export const toISODate = (d: Date): string => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};

/** Add N days to a YYYY-MM-DD string and return a new YYYY-MM-DD string */
export const addDays = (dateStr: string, days: number): string => {
  const [y, m, d] = dateStr.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  date.setDate(date.getDate() + days);
  return toISODate(date);
};

/** Return today's date as YYYY-MM-DD (local) */
export const getTodayString = (): string => toISODate(new Date());

/** Return tomorrow's date as YYYY-MM-DD (local) */
export const getTomorrowString = (): string => addDays(getTodayString(), 1);

/** Build a unique cache key for a date + time slot pair */
export const slotKey = (date?: string, time?: string): string =>
  `${date ?? ''}||${time ?? ''}`;

/** Extract the start time (HH:MM) from a range string like "10:00-11:00" */
export const getRangeStart = (range: string): string => range.split('-')[0];

// TIMEZONE CONSTANTS
const VILNIUS_TZ = 'Europe/Vilnius';
// ---------------------------------------------------------------------------
// INTERNAL HELPER: convert a "Vilnius local" ISO string to a real UTC Date.
// Treat the input string as Vilnius local time regardless of runtime TZ.
//
// Example — user picks 17:00 in Vilnius (UTC+3 / EEST):
//   asUtc        = 2025-05-10T17:00:00Z
//   vilniusShown = 2025-05-10T20:00:00Z  (Intl says "UTC+3 shows 20:00 for 17:00Z")
//   offset       = +3 h
//   result       = 2025-05-10T14:00:00Z  <- correct UTC representation of 17:00 Vilnius
// ---------------------------------------------------------------------------
function vilniusLocalToUTC(localIso: string): Date | null {
  // Treat the string as UTC to get a reference Date
  const asUtc = new Date(`${localIso}Z`);
  if (isNaN(asUtc.getTime())) return null;

  // What does Vilnius *display* for this UTC moment?
  // sv-SE locale returns a sortable "YYYY-MM-DD HH:MM:SS" format.
  const vilniusDisplayed = asUtc.toLocaleString('sv-SE', { timeZone: VILNIUS_TZ });
  const vilniusShown = new Date(`${vilniusDisplayed}Z`);

  // offset in ms: how far ahead Vilnius is from UTC at this instant
  const offsetMs = vilniusShown.getTime() - asUtc.getTime();

  // Subtract the offset to go from "local treated as UTC" -> actual UTC
  return new Date(asUtc.getTime() - offsetMs);
}

export const parseDateTime = (date?: string, range?: string): Date | null => {
  if (!date || !range) return null;
  const start = getRangeStart(range);
  const result = vilniusLocalToUTC(`${date}T${start}:00`);
  return result;
};

// DISPLAY HELPERS

/**
 * Format a UTC datetime (ISO string or Date) as a short Vilnius date.
 * e.g. "2025-05-10T14:00:00.000Z" -> "2025-05-10"
 */
export const formatVilniusDate = (utc: string | Date): string => {
  const d = typeof utc === 'string' ? new Date(utc) : utc;
  return d.toLocaleDateString('sv-SE', { timeZone: VILNIUS_TZ }); // "YYYY-MM-DD"
};

/**
 * Format a UTC datetime (ISO string or Date) as a Vilnius time string.
 * e.g. "2025-05-10T14:00:00.000Z" -> "17:00"
 */
export const formatVilniusTime = (utc: string | Date): string => {
  const d = typeof utc === 'string' ? new Date(utc) : utc;
  return d.toLocaleTimeString('lt-LT', {
    timeZone: VILNIUS_TZ,
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
};

/**
 * Format a UTC datetime (ISO string or Date) as a full Vilnius date + time
 * label suitable for the order confirmation page.
 * e.g. "2025-05-10T14:00:00.000Z" -> "Šeš, 10 geg., 17:00"
 */
export const formatVilniusDateTime = (utc: string | Date): string => {
  const d = typeof utc === 'string' ? new Date(utc) : utc;
  return d.toLocaleString('lt-LT', {
    timeZone: VILNIUS_TZ,
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
};

// DATE PICKER HELPERS

const LT_DAYS_SHORT = ['Sek', 'Pir', 'Ant', 'Tre', 'Ket', 'Pen', 'Šeš'] as const;
const LT_MONTHS_GEN = [
  'sausio', 'vasario', 'kovo', 'balandžio', 'gegužės',
  'birželio', 'liepos', 'rugpjūčio', 'rugsėjo', 'spalio', 'lapkričio', 'gruodžio',
] as const;

export interface DateOption {
  value: string; // YYYY-MM-DD (local)
  label: string; // Lithuanian label
}

export const getUpcomingDates = (minDate: string, count = 14): DateOption[] => {
  const options: DateOption[] = [];

  const now = new Date();
  const todayStr = toISODate(now);
  const [ty, tm, td] = todayStr.split('-').map(Number);
  const today = new Date(ty, tm - 1, td);

  const [my, mm, md] = minDate.split('-').map(Number);
  const min = new Date(my, mm - 1, md);

  const start = min > today ? min : today;

  for (let i = 0; options.length < count; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);

    const value = toISODate(d);
    const diffMs = d.getTime() - today.getTime();
    const diff = Math.round(diffMs / 86_400_000);

    let label: string;
    if (diff === 0) label = 'Šiandien';
    else if (diff === 1) label = 'Rytoj';
    else label = `${LT_DAYS_SHORT[d.getDay()]}, ${d.getDate()} ${LT_MONTHS_GEN[d.getMonth()].slice(0, 3)}.`;

    options.push({ value, label });
  }

  return options;
};

// ---------------------------------------------------------------------------
// NEW CLIENT/SERVER BRIDGE HELPER
// ---------------------------------------------------------------------------

/**
 * Convert a Vilnius date + time range into a strict UTC ISO string.
 * e.g., "2026-05-10" + "17:00-18:00" -> "2026-05-10T14:00:00.000Z"
 * Call this in useCheckoutSubmit before sending the payload to the server.
 */
export const slotToISO = (date?: string, range?: string): string | null => {
  const d = parseDateTime(date, range);
  return d ? d.toISOString() : null;
};