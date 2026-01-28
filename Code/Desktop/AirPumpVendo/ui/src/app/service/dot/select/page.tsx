// File: ui/app/service/dot/select/page.tsx
// Path: ui/app/service/dot/select/page.tsx

"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function DotSelect() {
  const [code, setCode] = useState("");
  const router = useRouter();

  const handleKeyPress = (val: string) => {
    if (code.length < 4) {
      setCode((prev) => prev + val);
    }
  };

  const handleBackspace = () => {
    setCode((prev) => prev.slice(0, -1));
  };

  const handleClear = () => {
    setCode("");
  };

  useEffect(() => {
    if (code.length === 4) {
      // Small delay for visual feedback before redirecting
      const timer = setTimeout(() => {
        router.push(`/service/dot/result?code=${code}`);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [code, router]);

  return (
    <main className="h-dvh overflow-hidden bg-slate-50 p-2">
      <div className="mx-auto grid h-full w-full max-w-[500px] grid-rows-[auto_1fr] gap-2">
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
              Enter your tire&apos;s 4-digit manufacturing code
            </p>
          </div>

          {/* Keypad and Input */}
          <div className="flex flex-col items-center justify-center gap-6 py-2">
            {/* Display */}
            <div className="flex gap-3">
              {[0, 1, 2, 3].map((i) => (
                <div
                  key={i}
                  className={`flex h-16 w-12 items-center justify-center rounded-xl border-2 text-[28px] font-bold transition-all ${
                    code.length > i
                      ? "border-emerald-500 bg-emerald-50 text-emerald-700 shadow-inner"
                      : "border-slate-200 bg-white text-slate-300"
                  }`}
                >
                  {code[i] || "•"}
                </div>
              ))}
            </div>

            {/* Keypad Grid */}
            <div className="grid w-full grid-cols-3 gap-3">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                <button
                  key={num}
                  onClick={() => handleKeyPress(num.toString())}
                  className="flex h-16 items-center justify-center rounded-2xl bg-slate-50 text-[24px] font-bold text-slate-700 shadow-sm transition active:scale-95 active:bg-slate-100 hover:bg-slate-100/50"
                >
                  {num}
                </button>
              ))}
              <button
                onClick={handleClear}
                className="flex h-16 items-center justify-center rounded-2xl bg-red-50 text-[14px] font-bold text-red-600 shadow-sm transition active:scale-95 active:bg-red-100"
              >
                CLEAR
              </button>
              <button
                onClick={() => handleKeyPress("0")}
                className="flex h-16 items-center justify-center rounded-2xl bg-slate-50 text-[24px] font-bold text-slate-700 shadow-sm transition active:scale-95 active:bg-slate-100 hover:bg-slate-100/50"
              >
                0
              </button>
              <button
                onClick={handleBackspace}
                className="flex h-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-600 shadow-sm transition active:scale-95 active:bg-slate-200 overflow-hidden"
              >
                <span className="material-symbols-rounded text-[28px]">
                  backspace
                </span>
              </button>
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
