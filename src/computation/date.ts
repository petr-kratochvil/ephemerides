import { JsonDate } from "../types";

export function addDays(date: JsonDate, days: number): JsonDate {
  const originDate = new Date(date.year, date.month - 1, date.day);
  originDate.setDate(originDate.getDate() + days);
  return {
    year: originDate.getFullYear(),
    month: originDate.getMonth() + 1,
    day: originDate.getDate(),
    hour: date.hour,
  };
}
