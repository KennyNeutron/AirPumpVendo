import Link from "next/link";

export default function DotService() {
  const TOTAL = 30; // ₱10 (info) + ₱20 (service)

  return (
    <main className="min-h-dvh p-6">
      <div className="mx-auto w-full max-w-5xl">
        {/* Back */}
        <div className="mb-6">
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

        {/* Card */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-10">
          <div className="grid place-items-center gap-3 text-center">
            <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-600">
              <span className="material-symbols-rounded text-[26px]">
                shield
              </span>
            </span>
            <h1 className="text-3xl font-semibold text-emerald-700">
              DOT Code Safety Check
            </h1>
            <p className="text-slate-500">
              Check your tire&apos;s manufacturing date and safety status
            </p>
          </div>

          {/* Instructions */}
          <div className="mt-6 rounded-xl border border-sky-200 bg-sky-50 p-5">
            <p className="mb-3 font-medium text-slate-800">
              Service Instructions
            </p>
            <ul className="space-y-2 text-slate-700">
              <li>
                <span className="font-semibold">Step 1:</span> Insert the total
                amount to start checking the DOT code (Tire Safety check)
              </li>
              <li>
                <span className="font-semibold">Step 2:</span> Choose your DOT
                code from the available options
              </li>
              <li>
                <span className="font-semibold">Step 3:</span> View your tire
                safety results
              </li>
            </ul>
          </div>

          {/* Total */}
          <p className="mt-8 text-center text-xl font-semibold text-slate-800">
            Total Amount: ₱{TOTAL}
          </p>

          {/* Continue */}
          <div className="mt-4">
            <Link
              href="/service/dot/select"
              className="block w-full max-w-[720px] mx-auto h-12 rounded-lg bg-slate-950 text-center leading-[48px] text-slate-50 font-semibold shadow-md hover:bg-slate-900 active:translate-y-px"
            >
              Payment Inserted - Continue
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
