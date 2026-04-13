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

/** Format a Date as YYYY-MM-DD */
export const toISODate = (d: Date): string => d.toISOString().split('T')[0];

/** Return tomorrow as YYYY-MM-DD */
export const getTomorrowString = (): string => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return toISODate(tomorrow);
};

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
  const start = getRangeStart(range);
  const d = new Date(`${date}T${start}:00`);
  if (Number.isNaN(d.getTime())) return null;
  return d;
};