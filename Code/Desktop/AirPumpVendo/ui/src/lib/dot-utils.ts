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
  const currentYear = 2026; // Setting to 2026 as per user's context/system time
  const currentWeek = getWeekNumber(now);

  const wStr = code.substring(0, 2);
  const yStr = code.substring(2, 4);
  const week = parseInt(wStr, 10) || 0;
  const year = 2000 + (parseInt(yStr, 10) || 0);

  // Age calculation
  let age = currentYear - year + (currentWeek - week) / 52;
  age = Math.round(age * 10) / 10;

  let status: DotStatus = "SAFE";

  // As per user requirement:
  // 2020 (6 years old) -> Caution
  // 2021-2026 -> Safe
  // 2027+ -> Safe (Not yet manufactured)

  if (year === 2020 || (age >= 6 && age < 10)) {
    status = "CAUTION";
  } else if (age >= 10 && year < 2020) {
    status = "REPLACE";
  } else {
    status = "SAFE";
  }

  return { code, week, year, ageYears: Math.max(0, age), status };
}
