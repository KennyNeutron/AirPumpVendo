// File: ui/app/service/inflation/page.tsx
// Path: ui/app/service/inflation/page.tsx
// Purpose: 7" 800×480 optimized Inflation UI; auto-sends "PAYMENT:<total>" on mount,
//          listens for "INSERTED:<amt>" and "PAYMENT COMPLETE", and during inflation
//          shows a live PSI progress bar. On completion, button switches to "Back to Home".

"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { getPsiPair, normalizeCode } from "@/lib/tire-data";
import { useSettings } from "@/lib/settings-context";

type Step = "payment" | "connect" | "inflate";

export default function InflationScreen() {
  const router = useRouter();
  const sp = useSearchParams();
  const { settings } = useSettings();
  const code = sp.get("code") ?? "";
  const pos = (sp.get("pos") === "rear" ? "rear" : "front") as "front" | "rear";
  const psiFromQuery = sp.get("psi");

  const targetPsi = useMemo(() => {
    const q = psiFromQuery ? parseInt(psiFromQuery, 10) : NaN;
    if (!Number.isNaN(q) && q > 0) return q;

    // Check built-in
    const pair = getPsiPair(code);
    if (pair) return pos === "front" ? pair.front : pair.rear;

    // Check custom settings
    const norm = normalizeCode(code);
    const custom = settings.tireCodes.find(
      (c) => normalizeCode(c.code) === norm
    );
    if (custom) return custom.psi;

    return 0;
  }, [psiFromQuery, code, pos, settings.tireCodes]);

  const [step, setStep] = useState<Step>("payment");
  const [inserted, setInserted] = useState<number>(0);
  const [inflationStarted, setInflationStarted] = useState<boolean>(false);
  const [currentPressure, setCurrentPressure] = useState<number | null>(null);
  const [completed, setCompleted] = useState<boolean>(false);

  const total = settings.prices.tireInfo + settings.prices.inflation;
  const posLabel = pos === "front" ? "Front" : "Rear";

  const label =
    step === "payment"
      ? "Payment Inserted - Continue"
      : step === "connect"
      ? "Hose Connected - Continue"
      : completed
      ? "Back to Home"
      : inflationStarted
      ? "Inflating..."
      : "Start Inflation";

  // Guard so PAYMENT send runs exactly once per mount
  const sentOnceRef = useRef(false);

  // Choose a port from the enumerated list in a platform-agnostic way.
  const choosePortFromList = (ports: any[]): string | null => {
    if (!Array.isArray(ports) || ports.length === 0) return null;
    const linuxUSB = ports.find(
      (p) => typeof p.path === "string" && p.path.startsWith("/dev/ttyUSB")
    );
    if (linuxUSB) return linuxUSB.path;
    const linuxACM = ports.find(
      (p) => typeof p.path === "string" && p.path.startsWith("/dev/ttyACM")
    );
    if (linuxACM) return linuxACM.path;
    const winCOM = ports.find(
      (p) => typeof p.path === "string" && /^COM\d+$/i.test(p.path)
    );
    if (winCOM) return winCOM.path;
    return typeof ports[0].path === "string" ? ports[0].path : null;
  };

  // Ensure a serial port is open (no write)
  const ensurePortOpen = async () => {
    const api = (window as any)?.electronAPI;
    if (!api) return false;

    const st = await api.serialStatus?.();
    if (st?.isOpen) return true;

    const ports = await api.serialList?.();
    const chosen = choosePortFromList(ports || []);
    if (!chosen) return false;

    const tryOpen = async (baud: number) => {
      try {
        await api.serialOpen(chosen, baud);
        return true;
      } catch {
        return false;
      }
    };
    if (!(await tryOpen(115200))) {
      if (!(await tryOpen(9600))) return false;
    }
    await new Promise((r) => setTimeout(r, 350));
    return true;
  };

  const sendPayment = async () => {
    const api = (window as any)?.electronAPI;
    if (!api) return;
    const ok = await ensurePortOpen();
    if (!ok) return;
    try {
      await api.serialWrite?.(`PAYMENT:${total}`);
    } catch (e) {
      console.warn("PAYMENT send failed:", e);
    }
  };

  useEffect(() => {
    if (sentOnceRef.current) return;
    sentOnceRef.current = true;
    void sendPayment();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Serial listener
  useEffect(() => {
    const api = (window as any)?.electronAPI;
    if (!api?.onSerialData) return;

    const unsubscribe = api.onSerialData((line: string) => {
      const raw = String(line || "").trim();
      const upper = raw.toUpperCase();

      if (upper.includes("PAYMENT COMPLETE")) {
        setStep((prev) => (prev === "payment" ? "connect" : prev));
        return;
      }

      const mInserted = /^INSERTED\s*:\s*(-?\d+(?:\.\d+)?)/i.exec(raw);
      if (mInserted) {
        const val = Math.max(0, Math.floor(Number(mInserted[1])));
        setInserted(val);
        return;
      }

      const mPressure = /^PRESSURE\s*:\s*(-?\d+(?:\.\d+)?)/i.exec(raw);
      if (mPressure) {
        const psi = Math.max(0, Number(mPressure[1]));
        const rounded = Math.round(psi);
        setCurrentPressure(rounded);
        // Auto-detect completion if at/above target
        if (targetPsi > 0 && rounded >= Math.round(targetPsi)) {
          setCompleted(true);
        }
        return;
      }

      // Explicit completion keywords from Arduino (optional)
      if (
        /(INFLATION\s*COMPLETE|INFLATE\s*COMPLETE|TARGET\s*REACHED|DONE)/i.test(
          raw
        )
      ) {
        setCompleted(true);
        return;
      }
    });

    return () => {
      try {
        unsubscribe?.();
      } catch {}
    };
  }, [targetPsi]);

  // Send INFLATE when starting; init pressure to 0 for the progress bar
  const sendInflate = async () => {
    const api = (window as any)?.electronAPI;
    if (!api) return;
    if (!Number.isFinite(targetPsi) || targetPsi <= 0) {
      console.warn("Invalid PSI; not sending INFLATE");
      return;
    }
    const ok = await ensurePortOpen();
    if (!ok) return;
    try {
      setInflationStarted(true);
      setCurrentPressure(0);
      setCompleted(false);
      await api.serialWrite?.(`INFLATE:${Math.round(targetPsi)}`);
    } catch (e) {
      console.warn("INFLATE send failed:", e);
    }
  };

  const advance = async () => {
    if (step === "payment") {
      setStep("connect");
    } else if (step === "connect") {
      setStep("inflate");
    } else {
      // step === "inflate"
      if (completed) {
        router.push("/");
      } else if (!inflationStarted) {
        await sendInflate();
      }
    }
  };

  const progress = useMemo(() => {
    if (!inflationStarted || !Number.isFinite(targetPsi) || targetPsi <= 0)
      return 0;
    const cp = currentPressure ?? 0;
    return Math.max(0, Math.min(100, Math.round((cp / targetPsi) * 100)));
  }, [inflationStarted, currentPressure, targetPsi]);

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

        <section className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm grid grid-rows-[auto_1fr_auto_auto] gap-2">
          <div className="text-center">
            <div className="mb-1 grid place-items-center">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-amber-500/20 text-amber-600">
                <span className="material-symbols-rounded text-[18px]">
                  speed
                </span>
              </span>
            </div>
            <h1 className="text-[18px] font-semibold text-amber-700">
              Tire Inflation Service
            </h1>
            <p className="text-[11px] text-slate-500">Follow the steps below</p>
            <p className="mt-0.5 font-semibold text-slate-800">
              Target PSI: {targetPsi > 0 ? targetPsi : "—"}
            </p>
          </div>

          <div className="grid content-center gap-2">
            {!inflationStarted && (
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
            )}

            {step === "inflate" && inflationStarted && (
              <div className="rounded-xl border border-slate-200 bg-white p-3">
                <div className="flex items-end justify-between">
                  <div className="text-[12px] text-slate-500">
                    Current Pressure
                  </div>
                  <div className="text-[12px] text-slate-500">{progress}%</div>
                </div>
                <div className="mt-2 h-4 w-full rounded-md bg-slate-200 overflow-hidden">
                  <div
                    className="h-full rounded-md bg-amber-500 transition-[width] duration-200"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <div className="mt-2 text-center text-[28px] leading-none font-bold text-slate-900 tracking-tight">
                  {currentPressure ?? 0}{" "}
                  <span className="text-[14px] font-semibold">PSI</span>
                  <span className="mx-2 text-slate-400 text-[14px] font-normal">
                    /
                  </span>
                  {Math.round(targetPsi)}{" "}
                  <span className="text-[14px] font-semibold">PSI</span>
                </div>
                {completed && (
                  <p className="mt-2 text-center text-[12px] font-medium text-green-700">
                    Inflation complete.
                  </p>
                )}
              </div>
            )}
          </div>

          <p className="text-center text-[15px] font-semibold text-slate-800">
            Total: ₱{total}
            <span className="mx-2 text-slate-400">•</span>
            Inserted:{" "}
            <span
              className={
                inserted >= total ? "text-green-700" : "text-amber-700"
              }
            >
              ₱{inserted}
            </span>
          </p>

          <button
            type="button"
            onClick={advance}
            className={`mx-auto block h-12 w-full max-w-[720px] rounded-lg text-base font-semibold shadow-md active:translate-y-px ${
              completed
                ? "bg-green-700 text-white hover:bg-green-600"
                : "bg-slate-950 text-slate-50 hover:bg-slate-900"
            }`}
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
