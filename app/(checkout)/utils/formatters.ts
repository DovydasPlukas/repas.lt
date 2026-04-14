export const formatDate = (dateString?: string): string => {
  if (!dateString) return '-';
  try {
    return new Intl.DateTimeFormat('lt-LT', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(new Date(dateString));
  } catch {
    return dateString;
  }
};

export const formatDateTime = (dateString?: string): string => {
  if (!dateString) return '-';
  try {
    return new Intl.DateTimeFormat('lt-LT', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(dateString));
  } catch {
    return dateString;
  }
};

export const formatTime = (dateString?: string): string => {
  if (!dateString) return '-';
  try {
    return new Intl.DateTimeFormat('lt-LT', {
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(dateString));
  } catch {
    return dateString;
  }
};

const inferEndIsoFromStart = (startIso?: string | null): string | null => {
  if (!startIso) return null;
  const d = new Date(startIso);
  if (isNaN(d.getTime())) return null;
  d.setHours(d.getHours() + 1);
  return d.toISOString();
};

const inferStartIsoFromEnd = (endIso?: string | null): string | null => {
  if (!endIso) return null;
  const d = new Date(endIso);
  if (isNaN(d.getTime())) return null;
  d.setHours(d.getHours() - 1);
  return d.toISOString();
};

export const formatRange = (start?: string | null, end?: string | null): string => {
  if (!start && !end) return '-';

  if (!start && end) start = inferStartIsoFromEnd(end);
  if (start && !end) end = inferEndIsoFromStart(start);

  if (!start || !end) return start ?? end ?? '-';

  try {
    const s = new Date(start);
    const e = new Date(end);
    if (isNaN(s.getTime()) || isNaN(e.getTime())) return `${start} - ${end}`;

    const sameDay =
      s.getFullYear() === e.getFullYear() &&
      s.getMonth() === e.getMonth() &&
      s.getDate() === e.getDate();

    if (sameDay) {
      const datePart = new Intl.DateTimeFormat('lt-LT', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }).format(s);
      return `${datePart} ${formatTime(start)} - ${formatTime(end)}`;
    }

    return `${formatDateTime(start)} - ${formatDateTime(end)}`;
  } catch {
    return `${start} - ${end}`;
  }
};