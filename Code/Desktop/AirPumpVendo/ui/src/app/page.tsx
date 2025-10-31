import Link from "next/link";

export default function Home() {
  return (
    <main className="h-dvh overflow-hidden p-3 grid place-items-center">
      <section className="w-[96vw] max-w-[760px] rounded-2xl bg-white shadow-lg p-4 grid grid-rows-[auto_1fr_auto] gap-3">
        {/* Header */}
        <div className="text-center">
          <div className="mb-2 flex justify-center gap-2">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-blue-500/15 text-blue-600">
              <span className="material-symbols-rounded text-[22px]">
                build
              </span>
            </span>
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-green-500/20 text-green-600">
              <span className="material-symbols-rounded text-[22px]">
                shield
              </span>
            </span>
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-amber-500/20 text-amber-600">
              <span className="material-symbols-rounded text-[22px]">
                speed
              </span>
            </span>
          </div>
          <h1 className="text-[22px] font-bold text-indigo-700">
            Tire Service Kiosk
          </h1>
          <p className="text-[13px] text-slate-500">
            Your complete tire safety and maintenance solution
          </p>
        </div>

        {/* Middle (features) */}
        <div className="grid place-items-center">
          <div className="flex flex-wrap items-center justify-center gap-5">
            <div className="grid justify-items-center gap-1 text-[12px] text-slate-600">
              <span className="material-symbols-rounded inline-grid h-6 w-6 place-items-center rounded-full bg-blue-500/15 text-blue-600 text-[18px]">
                text_snippet
              </span>
              <span>Tire Code Info</span>
            </div>
            <div className="grid justify-items-center gap-1 text-[12px] text-slate-600">
              <span className="material-symbols-rounded inline-grid h-6 w-6 place-items-center rounded-full bg-green-500/20 text-green-600 text-[18px]">
                shield
              </span>
              <span>DOT Safety Check</span>
            </div>
            <div className="grid justify-items-center gap-1 text-[12px] text-slate-600">
              <span className="material-symbols-rounded inline-grid h-6 w-6 place-items-center rounded-full bg-amber-500/20 text-amber-600 text-[18px]">
                speed
              </span>
              <span>Tire Inflation</span>
            </div>
          </div>
        </div>

        {/* CTA */}
        <Link
          href="/select-service"
          className="block h-12 w-full max-w-[520px] mx-auto rounded-lg bg-slate-950 text-slate-100 text-base font-bold text-center leading-[48px] shadow-md active:translate-y-px"
        >
          START
        </Link>
      </section>
    </main>
  );
}
