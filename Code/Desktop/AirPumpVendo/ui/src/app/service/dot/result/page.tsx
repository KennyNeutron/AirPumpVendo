// File: ui/app/service/dot/result/page.tsx
// Path: ui/app/service/dot/result/page.tsx

"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useMemo, useEffect, useRef } from "react";
import { parseDotCode } from "@/lib/dot-utils";
import { useSettings } from "@/lib/settings-context";
import { useTransactions } from "@/lib/transaction-context";

export default function DotResult() {
  const sp = useSearchParams();
  const code = sp.get("code") ?? "0000";
  const { settings } = useSettings();
  const { addTransaction } = useTransactions();
  const recorded = useRef(false);

  const info = useMemo(() => parseDotCode(code), [code]);
  const { status, week, year, ageYears } = info;

  useEffect(() => {
    if (!recorded.current) {
      recorded.current = true;
      addTransaction("DOT_CHECK", 0, `DOT ${code}`);
    }
  }, [code, addTransaction]);

  // Theme configuration based on status
  let theme = {
    icon: "check_circle",
    iconColor: "text-emerald-600",
    headerColor: "text-emerald-800",
    cardBg: "bg-emerald-50",
    cardBorder: "border-emerald-200",
    titleColor: "text-emerald-800",
    badgeBg: "bg-emerald-100",
    badgeText: "text-emerald-700",
    statusText: year > 2026 ? "NOT YET MANUFACTURED" : "SAFE TO USE",
    message:
      year > 2026
        ? "This DOT code indicates a manufacturing date in the future. Please double-check the code on your tire sidewall."
        : "Your tire is within the safe age range. Continue regular maintenance and monitor for signs of wear.",
    messageColor: "text-emerald-800",
  };

  if (status === "CAUTION") {
    theme = {
      icon: "warning",
      iconColor: "text-amber-500",
      headerColor: "text-emerald-800",
      cardBg: "bg-amber-50",
      cardBorder: "border-amber-200",
      titleColor: "text-amber-800",
      badgeBg: "bg-amber-100",
      badgeText: "text-amber-800",
      statusText: "CHECK CAREFULLY",
      message:
        year === 2020
          ? "This tire is 6 years old. It is generally safe but should be checked carefully and considered for replacement soon."
          : "Your tire is aging and approaching the recommended replacement time. Consider replacement soon and monitor closely for signs of wear.",
      messageColor: "text-amber-800",
    };
  } else if (status === "REPLACE") {
    theme = {
      icon: "error",
      iconColor: "text-red-600",
      headerColor: "text-emerald-800",
      cardBg: "bg-red-50",
      cardBorder: "border-red-200",
      titleColor: "text-red-800",
      badgeBg: "bg-red-100",
      badgeText: "text-red-800",
      statusText: "REPLACE IMMEDIATELY",
      message:
        "Your tire is too old and may be unsafe. Tires older than 10 years should be replaced immediately regardless of tread depth for your safety.",
      messageColor: "text-red-800",
    };
  }

  return (
    <main className="h-dvh overflow-hidden bg-slate-50 p-2">
      <div className="mx-auto grid h-full w-full max-w-[800px] grid-rows-[auto_1fr] gap-2">
        {/* Back Button (Hidden or minimal if flow requires, but good for dev) */}
        {/* Keeping consistent with other pages */}
        <div>
          <Link
            href="/service/dot/select"
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-[13px] font-medium text-slate-700 shadow-sm hover:bg-slate-50"
          >
            <span className="material-symbols-rounded text-[16px]">
              arrow_back
            </span>
            Back
          </Link>
        </div>

        {/* Main Content */}
        <section className="grid grid-rows-[auto_1fr_auto] gap-2 rounded-2xl bg-white p-4 shadow-lg overflow-hidden">
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
          </div>

          {/* Result Card */}
          <div
            className={`flex flex-col justify-center rounded-xl border ${theme.cardBorder} ${theme.cardBg} p-4`}
          >
            <div className="mb-4 flex items-center gap-2">
              <span
                className={`material-symbols-rounded text-[20px] ${theme.iconColor}`}
              >
                {theme.icon}
              </span>
              <h2 className={`text-[15px] font-semibold ${theme.titleColor}`}>
                Tire Safety Results
              </h2>
            </div>

            <div className="grid grid-cols-4 gap-4 text-center mb-4">
              <div>
                <p className="text-[10px] text-slate-500 mb-0.5">DOT Code</p>
                <p className="text-[16px] font-bold text-slate-800">{code}</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-500 mb-0.5">
                  Manufactured
                </p>
                <p className="text-[14px] font-medium text-slate-800">
                  Week {week}, {year}
                </p>
              </div>
              <div>
                <p className="text-[10px] text-slate-500 mb-0.5">Tire Age</p>
                <p className="text-[14px] font-medium text-slate-800">
                  {ageYears} years
                </p>
              </div>
              <div>
                <p className="text-[10px] text-slate-500 mb-0.5">
                  Safety Status
                </p>
                <span
                  className={`inline-block rounded px-2 py-1 text-[10px] font-bold uppercase tracking-wide ${theme.badgeBg} ${theme.badgeText}`}
                >
                  {theme.statusText}
                </span>
              </div>
            </div>

            <p className={`text-[12px] leading-relaxed ${theme.messageColor}`}>
              {theme.message}
            </p>
          </div>

          {/* Actions */}
          <div className="space-y-2">
            <Link
              href="/"
              className="block w-full rounded-lg border border-slate-200 bg-white py-2.5 text-center text-[13px] font-semibold text-slate-800 shadow-sm hover:bg-slate-50 active:translate-y-px"
            >
              Complete Service
            </Link>
            <Link
              href="/service/dot/select"
              className="block w-full py-1 text-center text-[12px] font-medium text-slate-600 hover:text-slate-900"
            >
              Check Different DOT Code
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
