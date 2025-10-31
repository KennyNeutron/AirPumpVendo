import Link from "next/link";

export default function SelectService() {
  return (
    <main className="min-h-dvh p-4">
      <div className="mx-auto w-full max-w-[800px]">
        <div className="mb-4 flex items-center justify-between">
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

        <div className="mb-4 text-center">
          <h1 className="text-2xl font-semibold text-indigo-700">
            Select Service
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Choose the service you need
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Link
            href="/service/tire"
            className="block rounded-xl border border-slate-200 bg-white p-4 shadow-sm hover:shadow-md transition"
          >
            <div className="mb-3 flex items-center justify-center">
              <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-blue-500/15 text-blue-600">
                <span className="material-symbols-rounded text-[28px]">
                  info
                </span>
              </span>
            </div>
            <h2 className="mb-1 text-center text-lg font-semibold text-blue-700">
              Tire Code Info &amp; Inflation
            </h2>
            <p className="mx-auto max-w-[36ch] text-center text-xs text-slate-600">
              Get recommended PSI for your tire code and optional inflation
            </p>
            <p className="mt-1 text-center text-xs text-slate-500">
              ₱10 (Info) + ₱20 (Inflation)
            </p>
          </Link>

          <Link
            href="/service/dot"
            className="block rounded-xl border border-slate-200 bg-white p-4 shadow-sm hover:shadow-md transition"
          >
            <div className="mb-3 flex items-center justify-center">
              <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-green-500/20 text-green-600">
                <span className="material-symbols-rounded text-[28px]">
                  shield
                </span>
              </span>
            </div>
            <h2 className="mb-1 text-center text-lg font-semibold text-green-700">
              DOT Code Safety Check
            </h2>
            <p className="mx-auto max-w-[36ch] text-center text-xs text-slate-600">
              Check tire manufacture date and safety status
            </p>
            <p className="mt-1 text-center text-xs text-slate-500">₱15</p>
          </Link>
        </div>
      </div>
    </main>
  );
}
