// File: ui/app/select-service/page.tsx
// Path: ui/app/select-service/page.tsx

"use client";

import Link from "next/link";
import { useSettings } from "@/lib/settings-context";

export default function SelectService() {
  const { settings } = useSettings();
  const { prices, services } = settings;

  return (
    <main className="h-dvh overflow-hidden p-3">
      <div className="mx-auto w-full max-w-[800px] h-full grid grid-rows-[auto_1fr] gap-3">
        {/* Top bar */}
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-[13px] font-medium text-slate-700 shadow-sm hover:bg-slate-50"
          >
            <span className="material-symbols-rounded text-[16px]">
              arrow_back
            </span>{" "}
            Back
          </Link>
          <Link
            href="/settings"
            aria-label="Settings"
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-300 bg-white text-slate-700 shadow-sm hover:bg-slate-50"
          >
            <span className="material-symbols-rounded text-[18px]">
              settings
            </span>
          </Link>
        </div>

        {/* Cards area */}
        <section className="grid content-center gap-3 md:grid-cols-2">
          <Link
            href="/service/tire"
            className="block rounded-xl border border-slate-200 bg-white p-4 shadow-sm hover:shadow-md transition"
          >
            <div className="mb-2 flex items-center justify-center">
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-blue-500/15 text-blue-600">
                <span className="material-symbols-rounded text-[24px]">
                  info
                </span>
              </span>
            </div>
            <h2 className="mb-0.5 text-center text-[18px] font-semibold text-blue-700">
              Tire Code Info &amp; Inflation
            </h2>
            <p className="mx-auto max-w-[36ch] text-center text-[12px] text-slate-600">
              Get recommended PSI and optional inflation
            </p>
            <p className="mt-1 text-center text-[12px] text-slate-500">
              ₱{prices.tireInfo + prices.inflation}
            </p>
          </Link>

          {services.dotCheckEnabled && (
            <Link
              href="/service/dot"
              className="block rounded-xl border border-slate-200 bg-white p-4 shadow-sm hover:shadow-md transition"
            >
              <div className="mb-2 flex items-center justify-center">
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-green-500/20 text-green-600">
                  <span className="material-symbols-rounded text-[24px]">
                    shield
                  </span>
                </span>
              </div>
              <h2 className="mb-0.5 text-center text-[18px] font-semibold text-green-700">
                DOT Code Safety Check
              </h2>
              <p className="mx-auto max-w-[36ch] text-center text-[12px] text-slate-600">
                Check tire manufacture date and safety
              </p>
              <p className="mt-1 text-center text-[12px] text-slate-500 font-bold text-green-600">
                {prices.dotCheck === 0 ? "Free" : `₱${prices.dotCheck}`}
              </p>
            </Link>
          )}
        </section>
      </div>
    </main>
  );
}
