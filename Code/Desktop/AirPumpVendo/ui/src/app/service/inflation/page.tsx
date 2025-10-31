"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { getPsiPair } from "@/lib/tire-data";

const INFO_COST = 10;
const INFLATION_COST = 20;
type Step = "payment" | "connect" | "inflate";

export default function InflationScreen() {
  const sp = useSearchParams();
  const code = sp.get("code") ?? "";
  const pos = (sp.get("pos") === "rear" ? "rear" : "front") as "front" | "rear";
  const psiFromQuery = sp.get("psi");

  const targetPsi = useMemo(() => {
    const q = psiFromQuery ? parseInt(psiFromQuery, 10) : NaN;
    if (!Number.isNaN(q) && q > 0) return q;
    const pair = getPsiPair(code);
    if (!pair) return 0;
    return pos === "front" ? pair.front : pair.rear;
  }, [psiFromQuery, code, pos]);

  const [step, setStep] = useState<Step>("payment");
  const total = INFO_COST + INFLATION_COST;
  const posLabel = pos === "front" ? "Front" : "Rear";

  const label =
    step === "payment"
      ? "Payment Inserted - Continue"
      : step === "connect"
      ? "Hose Connected - Continue"
      : "Start Inflation";

  const advance = () => {
    if (step === "payment") setStep("connect");
    else if (step === "connect") setStep("inflate");
    else alert("Inflation start requested (hardware integration pending).");
  };

  const backHref = `/service/tire/result?code=${encodeURIComponent(
    code
  )}&pos=${pos}&psi=${targetPsi}`;

  return (
    <main className="h-dvh overflow-hidden p-3">
      <div className="mx-auto w-full max-w-[800px] h-full grid grid-rows-[auto_1fr] gap-3">
        <div>
          <Link
            href={backHref}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-[13px] font-medium text-slate-700 shadow-sm hover:bg-slate-50"
          >
            <span className="material-symbols-rounded text-[16px]">
              arrow_back
            </span>{" "}
            Back
          </Link>
        </div>

        <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm grid grid-rows-[auto_1fr_auto_auto] gap-3">
          <div className="text-center">
            <div className="mb-2 grid place-items-center">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-amber-500/20 text-amber-600">
                <span className="material-symbols-rounded text-[22px]">
                  speed
                </span>
              </span>
            </div>
            <h1 className="text-[20px] font-semibold text-amber-700">
              Tire Inflation Service
            </h1>
            <p className="text-[12px] text-slate-500">Follow the steps below</p>
            <p className="mt-1 font-semibold text-slate-800">
              Target PSI: {targetPsi > 0 ? targetPsi : "—"}
            </p>
          </div>

          <div className="grid content-center">
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-3">
              <p className="mb-1.5 font-medium text-slate-800">
                Service Instructions
              </p>
              <ul className="space-y-1 text-slate-700 text-[12px]">
                <li>
                  <span className="font-semibold">Step 1:</span> Insert the
                  total amount
                </li>
                <li>
                  <span className="font-semibold">Step 2:</span> Connect the
                  hose
                </li>
                <li>
                  <span className="font-semibold">Step 3:</span> Tap Start to
                  inflate
                </li>
              </ul>
            </div>
          </div>

          <p className="text-center text-[15px] font-semibold text-slate-800">
            Total Amount: ₱{total}
          </p>

          <button
            type="button"
            onClick={advance}
            className="mx-auto block h-12 w-full max-w-[720px] rounded-lg bg-slate-950 text-slate-50 text-base font-semibold shadow-md hover:bg-slate-900 active:translate-y-px"
          >
            {label}
          </button>

          <div className="flex items-center justify-center gap-6 text-[12px]">
            <div className="flex items-center gap-2">
              <span
                className={`h-3 w-3 rounded-full ${
                  step !== "payment" ? "bg-green-600" : "bg-slate-300"
                }`}
              />
              <span
                className={
                  step === "payment"
                    ? "text-green-700 font-medium"
                    : "text-slate-500"
                }
              >
                Payment
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span
                className={`h-3 w-3 rounded-full ${
                  step === "inflate" || step === "connect"
                    ? "bg-green-600"
                    : "bg-slate-300"
                }`}
              />
              <span
                className={
                  step === "connect"
                    ? "text-green-700 font-medium"
                    : "text-slate-500"
                }
              >
                Connect
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span
                className={`h-3 w-3 rounded-full ${
                  step === "inflate" ? "bg-green-600" : "bg-slate-300"
                }`}
              />
              <span
                className={
                  step === "inflate"
                    ? "text-green-700 font-medium"
                    : "text-slate-500"
                }
              >
                Inflate
              </span>
            </div>
          </div>

          <p className="text-center text-[11px] text-slate-500">
            Code: <span className="font-mono">{code || "—"}</span> • Position:{" "}
            <span className="capitalize">{posLabel}</span>
          </p>
        </section>
      </div>
    </main>
  );
}
