"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { getPsiPair, normalizeCode } from "@/lib/tire-data";
import { useSettings } from "@/lib/settings-context";
import { useTransactions } from "@/lib/transaction-context";

export default function TireResult() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { settings } = useSettings();
  const { addTransaction } = useTransactions();
  const recorded = useRef(false);
  const [data, setData] = useState<{
    code: string;
    pos: "front" | "rear";
    psi: number;
    why: string;
  } | null>(null);

  useEffect(() => {
    const code = (searchParams.get("code") ?? "").trim();
    const pos = (searchParams.get("pos") === "rear" ? "rear" : "front") as
      | "front"
      | "rear";

    if (!code) {
      router.replace("/service/tire");
      return;
    }

    // 1. Try static data
    const pair = getPsiPair(code);
    if (pair) {
      const recommended = pos === "front" ? pair.front : pair.rear;
      const why =
        pos === "front"
          ? "Front tires use 2 PSI less for better steering and road contact."
          : "Rear tires use 2 PSI more to better support load weight.";
      setData({ code, pos, psi: recommended, why });

      if (!recorded.current) {
        recorded.current = true;
        addTransaction(
          "TIRE_INFO",
          settings.prices.tireInfo,
          `${code} (${pos})`,
        );
      }
      return;
    }

    // 2. Try dynamic settings
    const normalized = normalizeCode(code);
    const custom = settings.tireCodes.find(
      (c) => normalizeCode(c.code) === normalized,
    );

    if (custom) {
      setData({
        code: custom.code,
        pos,
        psi: custom.psi,
        why: "Custom PSI setting applied from device configuration.",
      });

      if (!recorded.current) {
        recorded.current = true;
        addTransaction(
          "TIRE_INFO",
          settings.prices.tireInfo,
          `${custom.code} (${pos})`,
        );
      }
      return;
    }

    // 3. Not found
    router.replace("/service/tire");
  }, [
    searchParams,
    settings.tireCodes,
    settings.prices.tireInfo,
    router,
    addTransaction,
  ]);

  if (!data) return null; // or a loading spinner

  const posLabel = data.pos === "front" ? "Front Tire" : "Rear Tire";

  return (
    <main className="h-dvh overflow-hidden p-3">
      <div className="mx-auto w-full max-w-[800px] h-full grid grid-rows-[auto_1fr] gap-3">
        {/* Top bar */}
        <div className="flex items-center justify-between">
          <Link
            href="/service/tire"
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

        {/* Card */}
        <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm grid grid-rows-[auto_auto_1fr_auto] gap-3">
          <div className="text-center">
            <div className="mb-2 grid place-items-center">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-indigo-500/15 text-indigo-600">
                <span className="material-symbols-rounded text-[22px]">
                  tire_repair
                </span>
              </span>
            </div>
            <h1 className="text-[20px] font-semibold text-indigo-700">
              PSI Recommendation
            </h1>
            <p className="text-[12px] text-slate-500">
              Based on your tire code and position
            </p>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <div className="rounded-xl border border-slate-200 bg-white p-3">
              <p className="text-[11px] text-slate-500">Tire Code</p>
              <p className="mt-1 text-lg font-semibold text-slate-800">
                {data.code}
              </p>
              <p className="mt-2 text-[11px] text-slate-500">Position</p>
              <p className="mt-1 font-medium text-indigo-600">{posLabel}</p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-3">
              <p className="text-[11px] text-slate-500">Recommended PSI</p>
              <p className="mt-1 text-3xl font-bold text-emerald-600">
                {data.psi}
              </p>
              <p className="mt-2 text-[11px] text-slate-500">Service Cost</p>
              <p className="mt-1 font-medium text-slate-800">
                ₱{settings.prices.tireInfo}
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-indigo-50 p-3">
            <p className="mb-0.5 font-semibold text-indigo-900 text-[13px]">
              Why this PSI?
            </p>
            <p className="text-[12px] text-indigo-900/80">{data.why}</p>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <Link
              href="/service/dot"
              className="block rounded-lg border border-slate-300 bg-white p-3 text-slate-800 shadow-sm hover:bg-slate-50"
            >
              <div className="flex items-center justify-center gap-2 font-semibold">
                <span className="material-symbols-rounded text-blue-600">
                  shield
                </span>
                <span>Check DOT Code</span>
              </div>
              <p className="mt-1 text-center text-[12px] text-slate-500">
                {settings.prices.dotCheck === 0
                  ? "Free"
                  : `₱${settings.prices.dotCheck}`}
              </p>
            </Link>

            <Link
              href={`/service/inflation?code=${encodeURIComponent(
                data.code,
              )}&pos=${data.pos}&psi=${data.psi}`}
              className="block rounded-lg bg-slate-900 p-3 text-slate-50 shadow-sm hover:bg-slate-800"
            >
              <div className="flex items-center justify-center gap-2 font-semibold">
                <span className="material-symbols-rounded">tire_repair</span>
                <span>Proceed to Tire Inflation</span>
              </div>
              <p className="mt-1 text-center text-[12px] text-slate-300">
                ₱{settings.prices.inflation}
              </p>
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
