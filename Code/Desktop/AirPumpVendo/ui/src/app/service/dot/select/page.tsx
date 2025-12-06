// File: ui/app/service/dot/select/page.tsx
// Path: ui/app/service/dot/select/page.tsx

"use client";

import Link from "next/link";
import { useMemo } from "react";

// Sample data from the screenshot
const SAMPLE_CODES = [
  "1017",
  "1021",
  "2018",
  "2023",
  "2212",
  "3015",
  "3522",
  "4519",
  "0124",
  "0514",
];

type DotStatus = "SAFE" | "CAUTION" | "REPLACE";

interface DotInfo {
  code: string;
  week: number;
  year: number;
  ageYears: number;
  status: DotStatus;
}

export default function DotSelect() {
  const data: DotInfo[] = useMemo(() => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentWeek = getWeekNumber(now);

    return SAMPLE_CODES.map((code) => {
      const wStr = code.substring(0, 2);
      const yStr = code.substring(2, 4);
      const week = parseInt(wStr, 10);
      const year = 2000 + parseInt(yStr, 10); // Assuming 2000s

      // Approximate age calculation
      // Age = (CurrentYear - Year) + (CurrentWeek - Week) / 52
      let age = currentYear - year + (currentWeek - week) / 52;
      // Clamp to 1 decimal
      age = Math.round(age * 10) / 10;

      let status: DotStatus = "SAFE";
      if (age > 10) status = "REPLACE";
      else if (age > 6) status = "CAUTION";

      return { code, week, year, ageYears: age, status };
    });
  }, []);

  return (
    <main className="h-dvh overflow-hidden bg-slate-50 p-2">
      <div className="mx-auto grid h-full w-full max-w-[800px] grid-rows-[auto_1fr] gap-2">
        {/* Back Button */}
        <div>
          <Link
            href="/service/dot"
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-[13px] font-medium text-slate-700 shadow-sm hover:bg-slate-50"
          >
            <span className="material-symbols-rounded text-[16px]">
              arrow_back
            </span>
            Back
          </Link>
        </div>

        {/* Main Card */}
        <section className="grid grid-rows-[auto_1fr_auto] gap-2 rounded-2xl bg-white p-3 shadow-lg overflow-hidden">
          {/* Header */}
          <div className="text-center">
            <div className="mb-1 grid place-items-center">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                <span className="material-symbols-rounded text-[20px]">
                  shield
                </span>
              </span>
            </div>
            <h1 className="text-[18px] font-semibold text-emerald-800">
              DOT Code Safety Check
            </h1>
            <p className="text-[11px] text-slate-500">
              Check your tire&apos;s manufacturing date and safety status
            </p>
            <div className="mt-1.5">
              <span className="text-[12px] font-medium text-slate-700">
                Service Cost: ₱15
              </span>
              <p className="text-[10px] text-slate-400">
                Select your DOT code to check tire safety
              </p>
            </div>
          </div>

          {/* Grid Content */}
          <div className="overflow-y-auto pr-1">
            <div className="grid grid-cols-3 gap-2">
              {data.map((item) => (
                <Card key={item.code} item={item} />
              ))}
            </div>
          </div>

          {/* Footer Info */}
          <div className="rounded-xl bg-slate-50 p-2 text-center">
            <p className="mb-0.5 text-[11px] font-semibold text-slate-800">
              How to find your DOT code:
            </p>
            <p className="text-[10px] text-slate-500 leading-tight">
              Look on the sidewall of your tire for &quot;DOT&quot; followed by
              letters and numbers. The last 4 digits represent the week and year
              of manufacture (e.g., &quot;0718&quot; = 7th week of 2018).
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}

function Card({ item }: { item: DotInfo }) {
  const { status, code, week, year, ageYears } = item;

  let borderColor = "border-emerald-200";
  let bgColor = "bg-emerald-50";
  let iconColor = "text-emerald-600";
  let icon = "check_circle";
  let badgeClass = "bg-emerald-100 text-emerald-700";

  if (status === "CAUTION") {
    borderColor = "border-amber-200";
    bgColor = "bg-amber-50";
    iconColor = "text-amber-600";
    icon = "warning";
    badgeClass = "bg-amber-100 text-amber-700";
  } else if (status === "REPLACE") {
    borderColor = "border-red-200";
    bgColor = "bg-red-50";
    iconColor = "text-red-600";
    icon = "error";
    badgeClass = "bg-red-100 text-red-700";
  }

  return (
    <div
      className={`flex flex-col items-center justify-center rounded-xl border ${borderColor} ${bgColor} p-2 shadow-sm transition hover:shadow-md`}
    >
      <div className={`mb-1 flex items-center gap-1.5 ${iconColor}`}>
        <span className="material-symbols-rounded text-[18px]">{icon}</span>
        <span className="text-[16px] font-bold text-slate-700">{code}</span>
      </div>
      <p className="text-[10px] text-slate-500">
        Manufactured: Week {week}, {year}
      </p>
      <p className="my-1 text-[14px] font-semibold text-slate-800">
        {ageYears} years old
      </p>
      <span
        className={`rounded px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide ${badgeClass}`}
      >
        {status}
      </span>
    </div>
  );
}

// Helper to get ISO week number
function getWeekNumber(d: Date): number {
  const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const dayNum = date.getUTCDay() || 7;
  date.setUTCDate(date.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
  return Math.ceil(((date.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
}
