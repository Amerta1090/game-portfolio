export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
  });
}

export function formatDateRange(start: string, end: string | null): string {
  const startFormatted = formatDate(start);
  const endFormatted = end ? formatDate(end) : 'Present';
  return `${startFormatted} — ${endFormatted}`;
}

export function truncate(str: string, maxLen: number): string {
  if (str.length <= maxLen) return str;
  return str.slice(0, maxLen - 1) + '\u2026';
}
