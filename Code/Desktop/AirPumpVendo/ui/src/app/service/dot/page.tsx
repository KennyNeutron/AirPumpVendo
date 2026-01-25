// File: ui/app/service/dot/page.tsx
// Path: ui/app/service/dot/page.tsx

"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useSettings } from "@/lib/settings-context";

// Prefer Linux USB/ACM, then Windows COM, then first port
const choosePortFromList = (ports: any[]): string | null => {
  if (!Array.isArray(ports) || ports.length === 0) return null;
  const linuxUSB = ports.find(
    (p) => typeof p.path === "string" && p.path.startsWith("/dev/ttyUSB"),
  );
  if (linuxUSB) return linuxUSB.path;
  const linuxACM = ports.find(
    (p) => typeof p.path === "string" && p.path.startsWith("/dev/ttyACM"),
  );
  if (linuxACM) return linuxACM.path;
  const winCOM = ports.find(
    (p) => typeof p.path === "string" && /^COM\d+$/i.test(p.path),
  );
  if (winCOM) return winCOM.path;
  return typeof ports[0].path === "string" ? ports[0].path : null;
};

export default function DotService() {
  const { settings } = useSettings();
  const TOTAL = settings.prices.dotCheck;
  const sentOnceRef = useRef(false);
  const [inserted, setInserted] = useState<number>(0);
  const [completed, setCompleted] = useState<boolean>(false);

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

  // Send "PAYMENT:TOTAL" once when this screen is shown
  const sendPayment = async () => {
    const api = (window as any)?.electronAPI;
    if (!api) return;
    const ok = await ensurePortOpen();
    if (!ok) return;
    try {
      await api.serialWrite?.(`PAYMENT:${TOTAL}`);
    } catch (e) {
      console.warn("DOT PAYMENT send failed:", e);
    }
  };

  useEffect(() => {
    if (TOTAL === 0) {
      setCompleted(true);
      return;
    }
    if (sentOnceRef.current) return;
    sentOnceRef.current = true;
    void sendPayment();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [TOTAL]);

  // Serial listener
  useEffect(() => {
    const api = (window as any)?.electronAPI;
    if (!api?.onSerialData) return;

    const unsubscribe = api.onSerialData((line: string) => {
      const raw = String(line || "").trim();
      const upper = raw.toUpperCase();

      if (upper.includes("PAYMENT COMPLETE")) {
        if (TOTAL > 0) setCompleted(true);
        return;
      }

      const mInserted = /^INSERTED\s*:\s*(-?\d+(?:\.\d+)?)/i.exec(raw);
      if (mInserted) {
        const val = Math.max(0, Math.floor(Number(mInserted[1])));
        setInserted(val);
        return;
      }
    });

    return () => {
      try {
        unsubscribe?.();
      } catch {}
    };
  }, [TOTAL]);

  const isFree = TOTAL === 0;

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
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-amber-100 text-amber-700">
              <span className="material-symbols-rounded text-[26px]">
                warning
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

          <div className="space-y-3 text-[13px] text-slate-700">
            <p>
              This service checks your tire&apos;s DOT code to determine its
              manufacturing week and year. Old tires can be dangerous even if
              they still look fine.
            </p>

            <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5">
              <p className="font-semibold text-slate-800 mb-1">
                Service Fee Breakdown
              </p>
              <ul className="space-y-1 text-[13px]">
                <li className="flex justify-between">
                  <span>DOT Code Safety Check</span>
                  <span className="font-medium">
                    {isFree ? "Free" : `₱${TOTAL}`}
                  </span>
                </li>
              </ul>
              <div className="mt-2 border-t border-slate-200 pt-1.5 flex justify-between text-[13px] font-semibold">
                <span>Total</span>
                <span>{isFree ? "Free" : `₱${TOTAL}`}</span>
              </div>
            </div>

            {!isFree && (
              <p className="text-center text-[15px] font-semibold text-slate-800">
                Total: ₱{TOTAL}
                <span className="mx-2 text-slate-400">•</span>
                Inserted:{" "}
                <span
                  className={
                    inserted >= TOTAL ? "text-green-700" : "text-amber-700"
                  }
                >
                  ₱{inserted}
                </span>
              </p>
            )}

            <p className="text-[12px] text-slate-500">
              {isFree
                ? "This service is currently free. Press Continue to proceed."
                : "Insert coins or bills at the payment module. Once payment is complete, you can proceed to enter your tire's DOT code."}
            </p>
          </div>

          {completed ? (
            <Link
              href="/service/dot/select"
              className="block w-full max-w-[720px] mx-auto h-12 rounded-full bg-green-700 text-center text-[14px] font-semibold text-white shadow-md hover:bg-green-600 active:translate-y-px"
            >
              <span className="inline-flex h-full items-center justify-center gap-2">
                <span className="material-symbols-rounded text-[18px]">
                  {isFree ? "arrow_forward" : "check_circle"}
                </span>
                {isFree ? "Continue" : "Payment Complete - Continue"}
              </span>
            </Link>
          ) : (
            <button
              type="button"
              disabled
              className="block w-full max-w-[720px] mx-auto h-12 rounded-full bg-slate-200 text-center text-[14px] font-semibold text-slate-400 cursor-not-allowed"
            >
              <span className="inline-flex h-full items-center justify-center gap-2">
                <span className="material-symbols-rounded text-[18px]">
                  payments
                </span>
                Insert Payment to Continue
              </span>
            </button>
          )}
        </section>
      </div>
    </main>
  );
}
