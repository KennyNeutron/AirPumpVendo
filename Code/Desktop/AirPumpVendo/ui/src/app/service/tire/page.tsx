"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { isSupportedCode, normalizeCode } from "@/lib/tire-data";
import { useSettings } from "@/lib/settings-context";

export default function TireService() {
  const router = useRouter();
  const { settings } = useSettings();
  const [code, setCode] = useState("");
  const [pos, setPos] = useState<"front" | "rear">("front");
  const [error, setError] = useState<string | null>(null);

  const valid = useMemo(() => {
    const norm = normalizeCode(code);
    if (norm.length === 0) return false;
    // Check built-in or custom settings
    if (isSupportedCode(norm)) return true;
    return settings.tireCodes.some((c) => normalizeCode(c.code) === norm);
  }, [code, settings.tireCodes]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!valid)
      return setError("Tire code not found. Please check formatting.");
    setError(null);
    const q = new URLSearchParams({ code: code.trim(), pos });
    router.push(`/service/tire/result?${q.toString()}`);
  };

  return (
    <main className="h-dvh overflow-hidden p-3">
      <div className="mx-auto w-full max-w-[800px] h-full grid grid-rows-[auto_1fr] gap-3">
        {/* Back */}
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

        {/* Card */}
        <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm grid grid-rows-[auto_1fr_auto]">
          {/* Header */}
          <div className="text-center">
            <div className="mb-2 grid place-items-center">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-blue-500/15 text-blue-600">
                <span className="material-symbols-rounded text-[22px]">
                  info
                </span>
              </span>
            </div>
            <h1 className="text-[20px] font-semibold text-indigo-700">
              Enter Your Tire Code
            </h1>
            <p className="text-[12px] text-slate-500">
              Enter code & position to get recommended PSI
            </p>
            <p className="mt-1 text-[12px] text-slate-600">
              <span className="font-semibold">Service Cost:</span> ₱
              {settings.prices.tireInfo}
            </p>
          </div>

          {/* Middle form */}
          <form
            onSubmit={submit}
            className="mx-auto max-w-[740px] grid content-center gap-3"
          >
            <div>
              <label className="mb-1 block text-[11px] font-medium text-slate-700">
                Tire Code
              </label>
              <input
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="e.g., 225/60R16 • 90/90-17 • 700x25C"
                className="w-full rounded-lg border border-slate-300 bg-slate-100/70 px-3 py-2.5 text-[14px] text-slate-800 placeholder:text-slate-400 focus:border-indigo-400 focus:bg-white focus:outline-none"
              />
              {error && (
                <p className="mt-1 text-[11px] font-medium text-red-600">
                  {error}
                </p>
              )}
            </div>

            <div>
              <p className="mb-1 text-[11px] font-medium text-slate-700">
                Tire Position
              </p>
              <div className="grid gap-3 md:grid-cols-2">
                <button
                  type="button"
                  onClick={() => setPos("front")}
                  className={`rounded-xl border p-3 text-left shadow-sm transition ${
                    pos === "front"
                      ? "border-indigo-400 bg-indigo-50"
                      : "border-slate-300 bg-white hover:bg-slate-50"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-rounded text-indigo-600">
                      radio_button_checked
                    </span>
                    <span className="font-medium text-slate-800">
                      Front Tires
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    2 PSI less for steering
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setPos("rear")}
                  className={`rounded-xl border p-3 text-left shadow-sm transition ${
                    pos === "rear"
                      ? "border-indigo-400 bg-indigo-50"
                      : "border-slate-300 bg-white hover:bg-slate-50"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-rounded text-indigo-600">
                      radio_button_checked
                    </span>
                    <span className="font-medium text-slate-800">
                      Rear Tires
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    2 PSI more for load
                  </p>
                </button>
              </div>
            </div>
          </form>

          {/* Bottom CTA */}
          <div className="pt-2">
            <button
              type="submit"
              onClick={submit as any}
              className="mx-auto block h-12 w-full max-w-[640px] rounded-lg bg-slate-900 text-center text-base font-semibold text-slate-50 shadow-md hover:bg-slate-800 active:translate-y-px"
            >
              Get PSI Recommendation
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}
