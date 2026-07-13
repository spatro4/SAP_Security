export function dayOfYear(date: Date = new Date()): number {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - start.getTime();
  return Math.floor(diff / 86400000);
}

export function pickDailyItem<T>(items: T[], date: Date = new Date()): T | undefined {
  if (items.length === 0) return undefined;
  const idx = dayOfYear(date) % items.length;
  return items[idx];
}

export function todayKey(date: Date = new Date()): string {
  return date.toISOString().slice(0, 10);
}
