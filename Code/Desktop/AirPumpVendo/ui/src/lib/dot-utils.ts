// File: ui/lib/dot-utils.ts
// Path: ui/lib/dot-utils.ts

export type DotStatus = "SAFE" | "CAUTION" | "REPLACE";

export interface DotInfo {
  code: string;
  week: number;
  year: number;
  ageYears: number;
  status: DotStatus;
}

// Helper to get ISO week number
export function getWeekNumber(d: Date): number {
  const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const dayNum = date.getUTCDay() || 7;
  date.setUTCDate(date.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
  return Math.ceil(((date.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
}

export function parseDotCode(code: string): DotInfo {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentWeek = getWeekNumber(now);

  const wStr = code.substring(0, 2);
  const yStr = code.substring(2, 4);
  const week = parseInt(wStr, 10) || 0;
  const year = 2000 + (parseInt(yStr, 10) || 0); // Assuming 2000s

  // Approximate age calculation
  // Age = (CurrentYear - Year) + (CurrentWeek - Week) / 52
  let age = currentYear - year + (currentWeek - week) / 52;
  // Clamp to 1 decimal
  age = Math.round(age * 10) / 10;
  if (age < 0) age = 0; // Prevent negative age if clock is wrong

  let status: DotStatus = "SAFE";
  if (age > 10) status = "REPLACE";
  else if (age > 6) status = "CAUTION";

  return { code, week, year, ageYears: age, status };
}
