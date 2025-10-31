export default function Home() {
  return (
    <main className="min-h-dvh grid place-items-center p-6">
      <section className="w-[92vw] max-w-[780px] rounded-2xl bg-white p-10 shadow-xl text-center">
        {/* Top icon badges (Material Symbols) */}
        <div className="mb-4 flex justify-center gap-4">
          <span
            aria-hidden="true"
            className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-blue-500/15 text-blue-600"
          >
            <span className="material-symbols-rounded text-[26px]">build</span>
          </span>

          <span
            aria-hidden="true"
            className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-green-500/20 text-green-600"
          >
            <span className="material-symbols-rounded text-[26px]">shield</span>
          </span>

          <span
            aria-hidden="true"
            className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-amber-500/20 text-amber-600"
          >
            <span className="material-symbols-rounded text-[26px]">speed</span>
          </span>
        </div>

        <h1 className="mb-2 text-[clamp(28px,4.2vw,42px)] font-bold tracking-tight text-indigo-700">
          Tire Service Kiosk
        </h1>
        <p className="mb-7 text-[clamp(14px,2vw,18px)] text-slate-500">
          Your complete tire safety and maintenance solution
        </p>

        {/* Feature list (Material Symbols) */}
        <div className="mb-6 flex flex-wrap items-center justify-center gap-8">
          <div className="grid min-w-[120px] justify-items-center gap-2 text-[15px] font-medium text-slate-600">
            <span
              aria-hidden="true"
              className="material-symbols-rounded inline-grid h-7 w-7 place-items-center rounded-full bg-blue-500/15 text-blue-600 text-[22px]"
            >
              text_snippet
            </span>
            <span>Tire Code Info</span>
          </div>

          <div className="grid min-w-[120px] justify-items-center gap-2 text-[15px] font-medium text-slate-600">
            <span
              aria-hidden="true"
              className="material-symbols-rounded inline-grid h-7 w-7 place-items-center rounded-full bg-green-500/20 text-green-600 text-[22px]"
            >
              shield
            </span>
            <span>DOT Safety Check</span>
          </div>

          <div className="grid min-w-[120px] justify-items-center gap-2 text-[15px] font-medium text-slate-600">
            <span
              aria-hidden="true"
              className="material-symbols-rounded inline-grid h-7 w-7 place-items-center rounded-full bg-amber-500/20 text-amber-600 text-[22px]"
            >
              speed
            </span>
            <span>Tire Inflation</span>
          </div>
        </div>

        <button
          type="button"
          className="mx-auto mt-1 block h-14 w-full max-w-[520px] rounded-lg bg-slate-950 text-slate-100 text-lg font-bold shadow-md active:translate-y-px"
        >
          START
        </button>
      </section>
    </main>
  );
}
