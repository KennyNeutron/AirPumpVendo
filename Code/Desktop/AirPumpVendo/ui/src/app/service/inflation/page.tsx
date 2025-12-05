// File: ui/app/service/inflation/page.tsx
// Purpose: 7" 800×480 optimized Inflation UI; auto-sends "PAYMENT:<total>" on mount,
//          listens for "PAYMENT COMPLETE" to auto-advance, and shows live "INSERTED:<amt>" updates.

"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
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
  const [inserted, setInserted] = useState<number>(0); // defaults to 0 until Arduino reports
  const total = INFO_COST + INFLATION_COST;
  const posLabel = pos === "front" ? "Front" : "Rear";

  const label =
    step === "payment"
      ? "Payment Inserted - Continue"
      : step === "connect"
      ? "Hose Connected - Continue"
      : "Start Inflation";

  // Guard so send runs exactly once per mount (even with Strict Mode double-invoke in dev).
  const sentOnceRef = useRef(false);

  // Choose a port from the enumerated list in a platform-agnostic way.
  const choosePortFromList = (ports: any[]): string | null => {
    if (!Array.isArray(ports) || ports.length === 0) return null;

    // Prefer Linux /dev/ttyUSB* then /dev/ttyACM*
    const linuxUSB = ports.find((p) => typeof p.path === "string" && p.path.startsWith("/dev/ttyUSB"));
    if (linuxUSB) return linuxUSB.path;
    const linuxACM = ports.find((p) => typeof p.path === "string" && p.path.startsWith("/dev/ttyACM"));
    if (linuxACM) return linuxACM.path;

    // Prefer Windows COM* ports
    const winCOM = ports.find((p) => typeof p.path === "string" && /^COM\d+$/i.test(p.path));
    if (winCOM) return winCOM.path;

    // Otherwise first path
    return typeof ports[0].path === "string" ? ports[0].path : null;
  };

  // Ensure a serial port is open, then send "PAYMENT:<total>"
  const ensurePortAndSend = async () => {
    const api = (window as any)?.electronAPI;
    if (!api) return;

    let st = await api.serialStatus?.();

    if (!st?.isOpen) {
      const ports = await api.serialList?.();
      const chosen = choosePortFromList(ports || []);
      if (chosen) {
        const tryOpen = async (baud: number) => {
          try {
            await api.serialOpen(chosen, baud);
            return true;
          } catch {
            return false;
          }
        };
        if (!(await tryOpen(115200))) {
          await tryOpen(9600);
        }
        // Small settle delay for boards that reset on open
        await new Promise((r) => setTimeout(r, 350));
      }
    }

    try {
      await api.serialWrite?.(`PAYMENT:${total}`);
    } catch (e) {
      console.warn("PAYMENT send failed:", e);
    }
  };

  // Auto-send on page load
  useEffect(() => {
    if (sentOnceRef.current) return;
    sentOnceRef.current = true;
    void ensurePortAndSend();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Listen for serial lines:
  //  - "PAYMENT COMPLETE" → advance to Connect
  //  - "INSERTED:<amt>"   → update current inserted pesos
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

      const m = /^INSERTED\s*:\s*(-?\d+(?:\.\d+)?)/i.exec(raw);
      if (m) {
        // Pesos are integers for this flow, but allow decimal then floor.
        const val = Math.max(0, Math.floor(Number(m[1])));
        setInserted(val);
      }
    });

    return () => {
      try {
        unsubscribe?.();
      } catch {}
    };
  }, []);

  const advance = async () => {
    if (step === "payment") {
      setStep("connect");
    } else if (step === "connect") {
      setStep("inflate");
    } else {
      alert("Inflation start requested (hardware integration pending).");
    }
  };

  const backHref = `/service/tire/result?code=${encodeURIComponent(code)}&pos=${pos}&psi=${targetPsi}`;

  return (
    <main className="h-dvh overflow-hidden p-3">
      <div className="mx-auto w-full max-w-[800px] h-full grid grid-rows-[auto_1fr] gap-3">
        <div>
          <Link
            href={backHref}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-[13px] font-medium text-slate-700 shadow-sm hover:bg-slate-50"
          >
            <span className="material-symbols-rounded text-[16px]">arrow_back</span> Back
          </Link>
        </div>

        <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm grid grid-rows-[auto_1fr_auto_auto] gap-3">
          <div className="text-center">
            <div className="mb-2 grid place-items-center">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-amber-500/20 text-amber-600">
                <span className="material-symbols-rounded text-[22px]">speed</span>
              </span>
            </div>
            <h1 className="text-[20px] font-semibold text-amber-700">Tire Inflation Service</h1>
            <p className="text-[12px] text-slate-500">Follow the steps below</p>
            <p className="mt-1 font-semibold text-slate-800">Target PSI: {targetPsi > 0 ? targetPsi : "—"}</p>
          </div>

          <div className="grid content-center">
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-3">
              <p className="mb-1.5 font-medium text-slate-800">Service Instructions</p>
              <ul className="space-y-1 text-slate-700 text-[12px]">
                <li><span className="font-semibold">Step 1:</span> Insert the total amount</li>
                <li><span className="font-semibold">Step 2:</span> Connect the hose</li>
                <li><span className="font-semibold">Step 3:</span> Tap Start to inflate</li>
              </ul>
            </div>
          </div>

          <p className="text-center text-[15px] font-semibold text-slate-800">
            Total: ₱{total}
            <span className="mx-2 text-slate-400">•</span>
            Inserted:{" "}
            <span className={inserted >= total ? "text-green-700" : "text-amber-700"}>
              ₱{inserted}
            </span>
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
              <span className={`h-3 w-3 rounded-full ${step !== "payment" ? "bg-green-600" : "bg-slate-300"}`} />
              <span className={step === "payment" ? "text-green-700 font-medium" : "text-slate-500"}>Payment</span>
            </div>
            <div className="flex items-center gap-2">
              <span className={`h-3 w-3 rounded-full ${step === "inflate" || step === "connect" ? "bg-green-600" : "bg-slate-300"}`} />
              <span className={step === "connect" ? "text-green-700 font-medium" : "text-slate-500"}>Connect</span>
            </div>
            <div className="flex items-center gap-2">
              <span className={`h-3 w-3 rounded-full ${step === "inflate" ? "bg-green-600" : "bg-slate-300"}`} />
              <span className={step === "inflate" ? "text-green-700 font-medium" : "text-slate-500"}>Inflate</span>
            </div>
          </div>

          <p className="text-center text-[11px] text-slate-500">
            Code: <span className="font-mono">{code || "—"}</span> • Position: <span className="capitalize">{posLabel}</span>
          </p>
        </section>
      </div>
    </main>
  );
}
