// File: ui/app/service/dot/page.tsx
// Path: ui/app/service/dot/page.tsx

"use client";

import Link from "next/link";
import { useSettings } from "@/lib/settings-context";

export default function DotService() {
  const { settings } = useSettings();

  return (
    <main className="h-dvh overflow-hidden p-3">
      <div className="mx-auto w-full max-w-[800px] h-full grid grid-rows-[auto_1fr] gap-3">
        {/* Top bar */}
        <div>
          <Link
            href="/select-service"
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-[13px] font-medium text-slate-700 shadow-sm hover:bg-slate-50"
          >
            <span className="material-symbols-rounded text-[16px]">
              arrow_back
            </span>
            Back
          </Link>
        </div>

        {/* Content card */}
        <section className="rounded-2xl bg-white shadow-lg p-4 grid grid-rows-[auto_1fr_auto] gap-3">
          <header className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
              <span className="material-symbols-rounded text-[26px]">
                shield
              </span>
            </div>
            <div>
              <h1 className="text-[20px] font-semibold text-slate-900">
                DOT Code Safety Check
              </h1>
              <p className="text-[13px] text-slate-600">
                Verify tire age and safety based on DOT manufacturing code.
              </p>
            </div>
          </header>

          <div className="space-y-4 text-[14px] text-slate-700">
            <p>
              This service checks your tire&apos;s DOT code to determine its
              manufacturing week and year. Old tires can be dangerous even if
              they still look fine.
            </p>

            <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-4">
              <h3 className="font-semibold text-emerald-900 mb-2 flex items-center gap-2">
                <span className="material-symbols-rounded text-[18px]">
                  info
                </span>
                Why check the DOT code?
              </h3>
              <p className="text-[13px] text-emerald-800 leading-relaxed">
                Tires degrade over time, even if not driven. Most safety experts
                recommend replacing tires that are more than 6-10 years old,
                regardless of tread wear. This check helps you stay safe on the
                road.
              </p>
            </div>

            <p className="text-[13px] text-slate-500 italic">
              * This service is provided free of charge for your safety.
            </p>
          </div>

          <Link
            href="/service/dot/select"
            className="block w-full max-w-[720px] mx-auto h-12 rounded-full bg-slate-900 text-center text-[14px] font-semibold text-white shadow-md hover:bg-slate-800 active:translate-y-px"
          >
            <span className="inline-flex h-full items-center justify-center gap-2">
              <span className="material-symbols-rounded text-[18px]">
                arrow_forward
              </span>
              Proceed to Safety Check
            </span>
          </Link>
        </section>
      </div>
    </main>
  );
}
