import Link from "next/link";

export default function SelectService() {
  return (
    <main className="min-h-dvh p-6">
      <div className="mx-auto w-full max-w-6xl">
        {/* Top bar */}
        <div className="mb-6 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50"
          >
            <span className="material-symbols-rounded text-base">
              arrow_back
            </span>
            Back
          </Link>
          <Link
            href="/settings"
            aria-label="Settings"
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-300 bg-white text-slate-700 shadow-sm hover:bg-slate-50"
          >
            <span className="material-symbols-rounded text-[20px]">
              settings
            </span>
          </Link>
        </div>

        {/* Title */}
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-semibold text-indigo-700">
            Select Service
          </h1>
          <p className="mt-2 text-slate-500">
            Choose the service you need for your tires
          </p>
        </div>

        {/* Cards */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Tire Code + Inflation */}
          <Link
            href="/service/tire"
            className="block rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md"
          >
            <div className="mb-4 flex items-center justify-center">
              <span className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-blue-500/15 text-blue-600">
                <span className="material-symbols-rounded text-[32px]">
                  info
                </span>
              </span>
            </div>
            <h2 className="mb-2 text-center text-xl font-semibold text-blue-700">
              Tire Code Info &amp; Inflation
            </h2>
            <p className="mx-auto mb-2 max-w-[36ch] text-center text-slate-600">
              Get recommended PSI for your tire code and optional inflation
              service
            </p>
            <p className="text-center text-sm text-slate-500">
              Cost: ₱10 (Info) + ₱20 (Inflation)
            </p>
          </Link>

          {/* DOT Safety Check */}
          <Link
            href="/service/dot"
            className="block rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md"
          >
            <div className="mb-4 flex items-center justify-center">
              <span className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-green-500/20 text-green-600">
                <span className="material-symbols-rounded text-[32px]">
                  shield
                </span>
              </span>
            </div>
            <h2 className="mb-2 text-center text-xl font-semibold text-green-700">
              DOT Code Safety Check
            </h2>
            <p className="mx-auto mb-2 max-w-[36ch] text-center text-slate-600">
              Check your tire&apos;s manufacturing date and safety status
            </p>
            <p className="text-center text-sm text-slate-500">Cost: ₱15</p>
          </Link>
        </div>
      </div>
    </main>
  );
}
