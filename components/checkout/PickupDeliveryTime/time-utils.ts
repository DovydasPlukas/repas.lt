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

/**Format a Date as YYYY-MM-DD using LOCAL date parts.*/
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

/**
 * Parse a date string and time-range into a Date object using the range's
 * start time. Returns null if inputs are missing or invalid.
 */
export const parseDateTime = (date?: string, range?: string): Date | null => {
  if (!date || !range) return null;
  const [y, m, d] = date.split('-').map(Number);
  const [h, min] = getRangeStart(range).split(':').map(Number);
  const dt = new Date(y, m - 1, d, h, min);
  if (Number.isNaN(dt.getTime())) return null;
  return dt;
};

const LT_DAYS_SHORT = ['Sek', 'Pir', 'Ant', 'Tre', 'Ket', 'Pen', 'Šeš'] as const;
const LT_MONTHS_GEN = [
  'sausio', 'vasario', 'kovo', 'balandžio', 'gegužės',
  'birželio', 'liepos', 'rugpjūčio', 'rugsėjo', 'spalio', 'lapkričio', 'gruodžio',
] as const;

export interface DateOption {
  value: string; // YYYY-MM-DD (local)
  label: string; // Lithuanian label
}

/**
 * Returns upcoming selectable dates starting from `minDate` (YYYY-MM-DD).
 *
 * For Pristatymas, pass minDate = addDays(pickupDate, 2) so "Rytoj" is never shown
 * and delivery is always at least 2 days after pickup.
 */
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