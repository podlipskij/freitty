import { config } from '@/config';

const dateFormat = new Intl.DateTimeFormat(config.locale, {
  day: 'numeric',
  month: 'short',
  timeZone: config.timeZone,
});
const longDateFormat = new Intl.DateTimeFormat(config.locale, {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
  timeZone: config.timeZone,
});
const dateTimeFormat = new Intl.DateTimeFormat(config.locale, {
  day: 'numeric',
  month: 'short',
  hour: '2-digit',
  minute: '2-digit',
  timeZone: config.timeZone,
});
const moneyFormat = new Intl.NumberFormat(config.moneyLocale, {
  style: 'currency',
  currency: config.currency,
  currencyDisplay: 'narrowSymbol',
});
const compactMoneyFormat = new Intl.NumberFormat(config.moneyLocale, {
  style: 'currency',
  currency: config.currency,
  currencyDisplay: 'narrowSymbol',
  notation: 'compact',
  maximumFractionDigits: 1,
});

const format = {
  date: (iso: string) => dateFormat.format(new Date(iso)),
  longDate: (iso: string) => longDateFormat.format(new Date(iso)),
  dateTime: (iso: string) => dateTimeFormat.format(new Date(iso)),
  isToday: (iso: string) => longDateFormat.format(new Date(iso)) === longDateFormat.format(new Date()),
  money: (value: number) => moneyFormat.format(value),
  compactMoney: (value: number) => compactMoneyFormat.format(value),
};

export default format;
