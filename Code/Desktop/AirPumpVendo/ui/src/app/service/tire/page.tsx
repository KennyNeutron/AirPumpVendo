"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { isSupportedCode, normalizeCode } from "@/lib/tire-data";
import { useSettings } from "@/lib/settings-context";

export default function TireService() {
  const router = useRouter();
  const { settings } = useSettings();

  // -- Existing: Tire Code State --
  const [code, setCode] = useState("");
  const [pos, setPos] = useState<"front" | "rear">("front");
  const [codeError, setCodeError] = useState<string | null>(null);

  // -- New: Manual PSI State --
  const [manualPsi, setManualPsi] = useState("");
  const [manualError, setManualError] = useState<string | null>(null);

  // -- Existing: Validation --
  const validCode = useMemo(() => {
    const norm = normalizeCode(code);
    if (norm.length === 0) return false;
    // Check built-in or custom settings
    if (isSupportedCode(norm)) return true;
    return settings.tireCodes.some((c) => normalizeCode(c.code) === norm);
  }, [code, settings.tireCodes]);

  const submitCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validCode)
      return setCodeError("Tire code not found. Please check formatting.");
    setCodeError(null);
    const q = new URLSearchParams({ code: code.trim(), pos });
    router.push(`/service/tire/result?${q.toString()}`);
  };

  const submitManual = (e: React.FormEvent) => {
    e.preventDefault();
    const psi = parseFloat(manualPsi);

    if (isNaN(psi)) {
      setManualError("Please enter a valid number.");
      return;
    }
    if (psi < 1 || psi > 120) {
      setManualError("PSI must be between 1 and 120.");
      return;
    }

    setManualError(null);
    // Navigate directly to inflation with manual code/pos
    // We use code="Manual" and default pos="front" (doesn't matter much for manual)
    const q = new URLSearchParams({
      code: "Manual",
      pos: "front",
      psi: psi.toString(),
    });
    router.push(`/service/inflation?${q.toString()}`);
  };

  return (
    <main className="h-dvh overflow-hidden p-3">
      <div className="mx-auto w-full max-w-[800px] h-full grid grid-rows-[auto_1fr] gap-3">
        {/* Back Button Row */}
        <div>
          <Link
            href="/select-service"
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-[13px] font-medium text-slate-700 shadow-sm hover:bg-slate-50"
          >
            <span className="material-symbols-rounded text-[16px]">
              arrow_back
            </span>{" "}
            Back
          </Link>
        </div>

        {/* Two-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 min-h-0">
          {/* LEFT: Tire Code Input */}
          <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm grid grid-rows-[auto_1fr_auto] h-full overflow-y-auto">
            {/* Header */}
            <div className="text-center">
              <div className="mb-2 grid place-items-center">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-blue-500/15 text-blue-600">
                  <span className="material-symbols-rounded text-[22px]">
                    info
                  </span>
                </span>
              </div>
              <h1 className="text-[18px] font-semibold text-indigo-700">
                Lookup by Code
              </h1>
              <p className="text-[11px] text-slate-500 leading-tight px-2">
                Enter code to get recommended PSI
              </p>
            </div>

            {/* Middle form */}
            <form
              id="code-form"
              onSubmit={submitCode}
              className="mt-4 grid content-start gap-3"
            >
              <div>
                <label className="mb-1 block text-[11px] font-medium text-slate-700">
                  Tire Code
                </label>
                <input
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="e.g., 225/60R16"
                  className="w-full rounded-lg border border-slate-300 bg-slate-100/70 px-3 py-2.5 text-[14px] text-slate-800 placeholder:text-slate-400 focus:border-indigo-400 focus:bg-white focus:outline-none"
                />
                {codeError && (
                  <p className="mt-1 text-[11px] font-medium text-red-600 leading-tight">
                    {codeError}
                  </p>
                )}
              </div>

              <div>
                <p className="mb-1 text-[11px] font-medium text-slate-700">
                  Position
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setPos("front")}
                    className={`rounded-lg border p-2 text-center shadow-sm transition ${
                      pos === "front"
                        ? "border-indigo-400 bg-indigo-50"
                        : "border-slate-300 bg-white hover:bg-slate-50"
                    }`}
                  >
                    <div className="text-[13px] font-semibold text-slate-800">
                      Front
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPos("rear")}
                    className={`rounded-lg border p-2 text-center shadow-sm transition ${
                      pos === "rear"
                        ? "border-indigo-400 bg-indigo-50"
                        : "border-slate-300 bg-white hover:bg-slate-50"
                    }`}
                  >
                    <div className="text-[13px] font-semibold text-slate-800">
                      Rear
                    </div>
                  </button>
                </div>
              </div>
            </form>

            {/* Bottom CTA */}
            <div className="pt-2 mt-auto">
              <button
                type="submit"
                form="code-form"
                onClick={submitCode as any}
                className="block h-10 w-full rounded-lg bg-indigo-600 text-center text-sm font-semibold text-white shadow-md hover:bg-indigo-500 active:translate-y-px"
              >
                Get Recommendation
              </button>
              <p className="mt-2 text-center text-[10px] text-slate-400">
                Info Cost: ₱{settings.prices.tireInfo}
              </p>
            </div>
          </section>

          {/* RIGHT: Manual PSI Input */}
          <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm grid grid-rows-[auto_1fr_auto] h-full overflow-y-auto">
            {/* Header */}
            <div className="text-center">
              <div className="mb-2 grid place-items-center">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-amber-500/15 text-amber-600">
                  <span className="material-symbols-rounded text-[22px]">
                    tune
                  </span>
                </span>
              </div>
              <h1 className="text-[18px] font-semibold text-amber-700">
                Manual Input
              </h1>
              <p className="text-[11px] text-slate-500 leading-tight px-2">
                Set your desired pressure manually
              </p>
            </div>

            {/* Middle form */}
            <form
              id="manual-form"
              onSubmit={submitManual}
              className="mt-4 grid content-center gap-3"
            >
              <div>
                <label className="mb-1 block text-[11px] font-medium text-slate-700">
                  Target PSI
                </label>
                <div className="relative">
                  <input
                    type="number"
                    inputMode="numeric"
                    value={manualPsi}
                    onChange={(e) => setManualPsi(e.target.value)}
                    placeholder="35"
                    className="w-full rounded-lg border border-slate-300 bg-slate-100/70 px-3 py-2.5 text-[14px] text-slate-800 placeholder:text-slate-400 focus:border-amber-400 focus:bg-white focus:outline-none"
                  />
                  <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                    <span className="text-xs font-medium text-slate-400">
                      PSI
                    </span>
                  </div>
                </div>
                {manualError && (
                  <p className="mt-1 text-[11px] font-medium text-red-600 leading-tight">
                    {manualError}
                  </p>
                )}
              </div>

              <div className="rounded-lg bg-amber-50 p-3 border border-amber-100">
                <div className="flex gap-2 items-start">
                  <span className="material-symbols-rounded text-amber-500 text-[18px] mt-px">
                    lightbulb
                  </span>
                  <p className="text-[11px] text-amber-800 leading-snug">
                    Use this if you already know your recommended tire pressure.
                  </p>
                </div>
              </div>
            </form>

            {/* Bottom CTA */}
            <div className="pt-2 mt-auto">
              <button
                type="submit"
                form="manual-form"
                onClick={submitManual as any}
                className="block h-10 w-full rounded-lg bg-slate-900 text-center text-sm font-semibold text-slate-50 shadow-md hover:bg-slate-800 active:translate-y-px"
              >
                Start Inflation
              </button>
              <p className="mt-2 text-center text-[10px] text-slate-400">
                Service Cost: ₱{settings.prices.inflation}
              </p>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
