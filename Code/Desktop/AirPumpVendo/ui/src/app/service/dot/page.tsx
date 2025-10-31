import Link from "next/link";

export default function DotService() {
  const TOTAL = 30;

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
          <div className="grid place-items-center gap-2 text-center">
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-600">
              <span className="material-symbols-rounded text-[24px]">
                shield
              </span>
            </span>
            <h1 className="text-2xl font-semibold text-emerald-700">
              DOT Code Safety Check
            </h1>
            <p className="text-sm text-slate-500">
              Check your tire’s manufacturing date and safety
            </p>
          </div>

          <div className="mt-5 rounded-xl border border-sky-200 bg-sky-50 p-4">
            <p className="mb-2 font-medium text-slate-800">
              Service Instructions
            </p>
            <ul className="space-y-1.5 text-slate-700 text-sm">
              <li>
                <span className="font-semibold">Step 1:</span> Insert the total
                amount
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

          <p className="mt-6 text-center text-lg font-semibold text-slate-800">
            Total Amount: ₱{TOTAL}
          </p>

          <div className="mt-3">
            <Link
              href="/service/dot/select"
              className="block w-full max-w-[720px] mx-auto h-12 rounded-lg bg-slate-950 text-center leading-[48px] text-slate-50 text-base font-semibold shadow-md hover:bg-slate-900 active:translate-y-px"
            >
              Payment Inserted - Continue
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
