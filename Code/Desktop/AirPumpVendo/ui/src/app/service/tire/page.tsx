"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { isSupportedCode } from "@/lib/tire-data";

export default function TireService() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [pos, setPos] = useState<"front" | "rear">("front");
  const [error, setError] = useState<string | null>(null);

  const valid = useMemo(
    () => code.trim().length > 0 && isSupportedCode(code),
    [code]
  );

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!valid)
      return setError("Tire code not found. Please check formatting.");
    setError(null);
    const q = new URLSearchParams({ code: code.trim(), pos });
    router.push(`/service/tire/result?${q.toString()}`);
  };

  return (
    <main className="min-h-dvh p-4">
      <div className="mx-auto w-full max-w-[800px]">
        <div className="mb-4">
          <Link
            href="/select-service"
            className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50"
          >
            <span className="material-symbols-rounded text-base">
              arrow_back
            </span>
            Back
          </Link>
        </div>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4 grid place-items-center gap-2 text-center">
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-blue-500/15 text-blue-600">
              <span className="material-symbols-rounded text-[24px]">info</span>
            </span>
            <h1 className="text-2xl font-semibold text-indigo-700">
              Enter Your Tire Code
            </h1>
            <p className="text-sm text-slate-500">
              Enter your tire code and position to get the recommended PSI
            </p>
          </div>

          <p className="mb-4 text-center text-sm text-slate-600">
            <span className="font-semibold">Service Cost:</span> ₱10
          </p>

          <form onSubmit={submit} className="mx-auto max-w-[720px] space-y-4">
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-700">
                Tire Code
              </label>
              <input
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="e.g., 225/60R16 • 90/90-17 • 700x25C"
                className="w-full rounded-lg border border-slate-300 bg-slate-100/70 px-3 py-3 text-slate-800 placeholder:text-slate-400 focus:border-indigo-400 focus:bg-white focus:outline-none"
              />
              <div className="mt-1 text-xs text-slate-500">
                Format examples: 205/55R16 • 225/60R16 • 90/90-17 • 700x25C
              </div>
              {error && (
                <p className="mt-1 text-xs font-medium text-red-600">{error}</p>
              )}
            </div>

            <div>
              <p className="mb-1 text-xs font-medium text-slate-700">
                Tire Position
              </p>
              <div className="grid gap-3 md:grid-cols-2">
                <button
                  type="button"
                  onClick={() => setPos("front")}
                  className={[
                    "rounded-xl border p-4 text-left shadow-sm transition",
                    pos === "front"
                      ? "border-indigo-400 bg-indigo-50"
                      : "border-slate-300 bg-white hover:bg-slate-50",
                  ].join(" ")}
                >
                  <div className="mb-1 flex items-center gap-2">
                    <span className="material-symbols-rounded text-indigo-600">
                      radio_button_checked
                    </span>
                    <span className="font-medium text-slate-800">
                      Front Tires
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">
                    2 PSI less for steering comfort
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setPos("rear")}
                  className={[
                    "rounded-xl border p-4 text-left shadow-sm transition",
                    pos === "rear"
                      ? "border-indigo-400 bg-indigo-50"
                      : "border-slate-300 bg-white hover:bg-slate-50",
                  ].join(" ")}
                >
                  <div className="mb-1 flex items-center gap-2">
                    <span className="material-symbols-rounded text-indigo-600">
                      radio_button_checked
                    </span>
                    <span className="font-medium text-slate-800">
                      Rear Tires
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">
                    2 PSI more to support load
                  </p>
                </button>
              </div>
            </div>

            <div className="pt-1">
              <button
                type="submit"
                className="mx-auto block h-12 w-full max-w-[640px] rounded-lg bg-slate-900 text-center text-base font-semibold text-slate-50 shadow-md hover:bg-slate-800 active:translate-y-px"
              >
                Get PSI Recommendation
              </button>
            </div>
          </form>
        </section>
      </div>
    </main>
  );
}
