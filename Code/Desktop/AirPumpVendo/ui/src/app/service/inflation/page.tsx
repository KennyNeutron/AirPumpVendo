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

  const stepBtnLabel =
    step === "payment"
      ? "Payment Inserted - Continue"
      : step === "connect"
      ? "Hose Connected - Continue"
      : "Start Inflation";

  const onStep = (s: Step) => step === s;
  const advance = () => {
    if (step === "payment") setStep("connect");
    else if (step === "connect") setStep("inflate");
    else {
      // Placeholder for Arduino trigger
      // TODO: start inflation IPC here
      alert("Inflation start requested (hardware integration pending).");
    }
  };

  const backHref = `/service/tire/result?code=${encodeURIComponent(
    code
  )}&pos=${pos}&psi=${targetPsi}`;

  return (
    <main className="min-h-dvh p-6">
      <div className="mx-auto w-full max-w-5xl">
        {/* Top bar */}
        <div className="mb-6">
          <Link
            href={backHref}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50"
          >
            <span className="material-symbols-rounded text-base">
              arrow_back
            </span>
            Back
          </Link>
        </div>

        {/* Card */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-10">
          <div className="grid place-items-center gap-3 text-center">
            <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-amber-500/20 text-amber-600">
              <span className="material-symbols-rounded text-[26px]">
                speed
              </span>
            </span>
            <h1 className="text-3xl font-semibold text-amber-700">
              Tire Inflation Service
            </h1>
            <p className="text-slate-500">
              Follow the steps below to inflate your tire
            </p>
            <p className="mt-1 font-semibold text-slate-800">
              Target PSI: {targetPsi > 0 ? targetPsi : "—"}
            </p>
          </div>

          {/* Instructions panel */}
          <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-5">
            <p className="mb-3 font-medium text-slate-800">
              Service Instructions
            </p>
            <ul className="space-y-2 text-slate-700">
              <li>
                <span className="font-semibold">Step 1:</span> Insert the total
                amount to begin
              </li>
              <li>
                <span className="font-semibold">Step 2:</span> Connect the hose
              </li>
              <li>
                <span className="font-semibold">Step 3:</span> Click Start
                button to inflate
              </li>
            </ul>
          </div>

          {/* Total */}
          <p className="mt-8 text-center text-xl font-semibold text-slate-800">
            Total Amount: ₱{total}
          </p>

          {/* Action button */}
          <div className="mt-4">
            <button
              type="button"
              onClick={advance}
              className="block w-full max-w-[720px] mx-auto h-12 rounded-lg bg-slate-950 text-slate-50 font-semibold shadow-md hover:bg-slate-900 active:translate-y-px"
            >
              {stepBtnLabel}
            </button>
          </div>

          {/* Stepper */}
          <div className="mt-6 flex items-center justify-center gap-8 text-sm">
            <div className="flex items-center gap-2">
              <span
                className={`h-3 w-3 rounded-full ${
                  onStep("payment") || step !== "payment"
                    ? "bg-green-600"
                    : "bg-slate-300"
                }`}
              />
              <span
                className={
                  onStep("payment")
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
                  step === "connect" || step === "inflate"
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

          {/* Context note */}
          <p className="mt-6 text-center text-sm text-slate-500">
            Code: <span className="font-mono">{code || "—"}</span> • Position:{" "}
            <span className="capitalize">{posLabel}</span>
          </p>
        </section>
      </div>
    </main>
  );
}
