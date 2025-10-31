import Link from "next/link";

export default function DotService() {
  const TOTAL = 30;

  return (
    <main className="h-dvh overflow-hidden p-3">
      <div className="mx-auto w-full max-w-[800px] h-full grid grid-rows-[auto_1fr] gap-3">
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

        <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm grid grid-rows-[auto_1fr_auto_auto] gap-3">
          <div className="text-center">
            <div className="mb-2 grid place-items-center">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-600">
                <span className="material-symbols-rounded text-[22px]">
                  shield
                </span>
              </span>
            </div>
            <h1 className="text-[20px] font-semibold text-emerald-700">
              DOT Code Safety Check
            </h1>
            <p className="text-[12px] text-slate-500">
              Check manufacture date and safety
            </p>
          </div>

          <div className="grid content-center">
            <div className="rounded-xl border border-sky-200 bg-sky-50 p-3">
              <p className="mb-1.5 font-medium text-slate-800">
                Service Instructions
              </p>
              <ul className="space-y-1 text-slate-700 text-[12px]">
                <li>
                  <span className="font-semibold">Step 1:</span> Insert the
                  total amount
                </li>
                <li>
                  <span className="font-semibold">Step 2:</span> Choose the DOT
                  code
                </li>
                <li>
                  <span className="font-semibold">Step 3:</span> View safety
                  results
                </li>
              </ul>
            </div>
          </div>

          <p className="text-center text-[15px] font-semibold text-slate-800">
            Total Amount: ₱{TOTAL}
          </p>

          <Link
            href="/service/dot/select"
            className="block w-full max-w-[720px] mx-auto h-12 rounded-lg bg-slate-950 text-center leading-[48px] text-slate-50 text-base font-semibold shadow-md hover:bg-slate-900 active:translate-y-px"
          >
            Payment Inserted - Continue
          </Link>
        </section>
      </div>
    </main>
  );
}
