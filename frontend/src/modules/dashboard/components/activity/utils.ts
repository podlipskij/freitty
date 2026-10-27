import { config } from '@/config';
import { ActivityPeriod } from '@/modules/dashboard/types';

const dayFormat = new Intl.DateTimeFormat(config.locale, { day: 'numeric', month: 'short', timeZone: config.timeZone });
const monthFormat = new Intl.DateTimeFormat(config.locale, { month: 'short', timeZone: config.timeZone });
const yearMonthFormat = new Intl.DateTimeFormat('en-CA', {
  year: 'numeric',
  month: 'numeric',
  day: 'numeric',
  timeZone: config.timeZone,
});

function zonedParts(iso: string) {
  const [year, month, day] = yearMonthFormat.format(new Date(iso)).split('-').map(Number);
  return { year, month, day };
}

function isoWeek(year: number, month: number, day: number): number {
  const date = new Date(Date.UTC(year, month - 1, day));
  const weekday = date.getUTCDay() || 7;
  date.setUTCDate(date.getUTCDate() + 4 - weekday);
  const yearStart = Date.UTC(date.getUTCFullYear(), 0, 1);
  return Math.ceil(((date.getTime() - yearStart) / 86_400_000 + 1) / 7);
}

export function bucketLabel(iso: string, period: ActivityPeriod): string {
  const { year, month, day } = zonedParts(iso);
  switch (period) {
    case 'day':
      return dayFormat.format(new Date(iso));
    case 'cw':
      return `W${isoWeek(year, month, day)}`;
    case 'month':
      return monthFormat.format(new Date(iso));
    case 'quarter':
      return `Q${Math.ceil(month / 3)} '${String(year).slice(2)}`;
  }
}
