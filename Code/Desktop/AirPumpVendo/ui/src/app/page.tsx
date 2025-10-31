import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-dvh grid place-items-center p-4">
      <section className="w-[94vw] max-w-[736px] rounded-2xl bg-white p-6 shadow-lg text-center">
        <div className="mb-3 flex justify-center gap-3">
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-blue-500/15 text-blue-600">
            <span className="material-symbols-rounded text-[24px]">build</span>
          </span>
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-green-500/20 text-green-600">
            <span className="material-symbols-rounded text-[24px]">shield</span>
          </span>
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-amber-500/20 text-amber-600">
            <span className="material-symbols-rounded text-[24px]">speed</span>
          </span>
        </div>

        <h1 className="mb-1 text-[24px] font-bold tracking-tight text-indigo-700">
          Tire Service Kiosk
        </h1>
        <p className="mb-5 text-sm text-slate-500">
          Your complete tire safety and maintenance solution
        </p>

        <div className="mb-5 flex flex-wrap items-center justify-center gap-6">
          <div className="grid min-w-[110px] justify-items-center gap-1.5 text-[13px] font-medium text-slate-600">
            <span className="material-symbols-rounded inline-grid h-6 w-6 place-items-center rounded-full bg-blue-500/15 text-blue-600 text-[20px]">
              text_snippet
            </span>
            <span>Tire Code Info</span>
          </div>
          <div className="grid min-w-[110px] justify-items-center gap-1.5 text-[13px] font-medium text-slate-600">
            <span className="material-symbols-rounded inline-grid h-6 w-6 place-items-center rounded-full bg-green-500/20 text-green-600 text-[20px]">
              shield
            </span>
            <span>DOT Safety Check</span>
          </div>
          <div className="grid min-w-[110px] justify-items-center gap-1.5 text-[13px] font-medium text-slate-600">
            <span className="material-symbols-rounded inline-grid h-6 w-6 place-items-center rounded-full bg-amber-500/20 text-amber-600 text-[20px]">
              speed
            </span>
            <span>Tire Inflation</span>
          </div>
        </div>

        <Link
          href="/select-service"
          className="mx-auto mt-1 block h-12 w-full max-w-[520px] rounded-lg bg-slate-950 text-center leading-[48px] text-slate-100 text-base font-bold shadow-md active:translate-y-px"
        >
          START
        </Link>
      </section>
    </main>
  );
}
