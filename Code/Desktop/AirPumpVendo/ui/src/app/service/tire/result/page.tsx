import Link from "next/link";
import { redirect } from "next/navigation";
import { getPsiPair } from "@/lib/tire-data";

type SearchParams = Promise<{ code?: string; pos?: "front" | "rear" }>;

export default async function TireResult({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const sp = await searchParams;
  const raw = (sp.code ?? "").trim();
  const pos = (sp.pos === "rear" ? "rear" : "front") as "front" | "rear";
  if (!raw) redirect("/service/tire");

  const pair = getPsiPair(raw);
  if (!pair) redirect("/service/tire");

  const recommended = pos === "front" ? pair.front : pair.rear;
  const posLabel = pos === "front" ? "Front Tire" : "Rear Tire";
  const why =
    pos === "front"
      ? "Front tires use 2 PSI less for better steering and road contact."
      : "Rear tires use 2 PSI more to better support load weight.";

  return (
    <main className="min-h-dvh p-4">
      <div className="mx-auto w-full max-w-[800px]">
        <div className="mb-4 flex items-center justify-between">
          <Link
            href="/service/tire"
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

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4 grid place-items-center gap-2 text-center">
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-indigo-500/15 text-indigo-600">
              <span className="material-symbols-rounded text-[24px]">
                tire_repair
              </span>
            </span>
            <h1 className="text-2xl font-semibold text-indigo-700">
              PSI Recommendation
            </h1>
            <p className="text-sm text-slate-500">
              Based on your tire code and position
            </p>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <div className="rounded-xl border border-slate-200 bg-white p-4">
              <p className="text-xs text-slate-500">Tire Code</p>
              <p className="mt-1 text-lg font-semibold text-slate-800">{raw}</p>
              <p className="mt-3 text-xs text-slate-500">Position</p>
              <p className="mt-1 font-medium text-indigo-600">{posLabel}</p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-4">
              <p className="text-xs text-slate-500">Recommended PSI</p>
              <p className="mt-1 text-3xl font-bold text-emerald-600">
                {recommended}
              </p>
              <p className="mt-3 text-xs text-slate-500">Service Cost</p>
              <p className="mt-1 font-medium text-slate-800">₱10</p>
            </div>
          </div>

          <div className="mt-4 rounded-xl border border-slate-200 bg-indigo-50 p-4">
            <p className="mb-1 font-semibold text-indigo-900">Why this PSI?</p>
            <p className="text-sm text-indigo-900/80">{why}</p>
          </div>

          <div className="mt-5 grid gap-3 md:grid-cols-2">
            <Link
              href="/service/dot"
              className="block rounded-lg border border-slate-300 bg-white p-3 text-slate-800 shadow-sm hover:bg-slate-50"
            >
              <div className="flex items-center justify-center gap-2 font-semibold">
                <span className="material-symbols-rounded text-blue-600">
                  shield
                </span>
                <span>Check DOT Code</span>
              </div>
              <p className="mt-1 text-center text-xs text-slate-500">₱15</p>
            </Link>

            <Link
              href={`/service/inflation?code=${encodeURIComponent(
                raw
              )}&pos=${pos}&psi=${recommended}`}
              className="block rounded-lg bg-slate-900 p-3 text-slate-50 shadow-sm hover:bg-slate-800"
            >
              <div className="flex items-center justify-center gap-2 font-semibold">
                <span className="material-symbols-rounded">tire_repair</span>
                <span>Proceed to Tire Inflation</span>
              </div>
              <p className="mt-1 text-center text-xs text-slate-300">₱20</p>
            </Link>
          </div>

          <div className="mt-4 text-center">
            <Link
              href="/service/tire"
              className="inline-block text-xs font-medium text-indigo-700 hover:underline"
            >
              Enter Different Tire Code
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
