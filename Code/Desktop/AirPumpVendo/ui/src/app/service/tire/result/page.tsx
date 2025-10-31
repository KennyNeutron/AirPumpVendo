import Link from "next/link";
import { redirect } from "next/navigation";
import { getPsiPair } from "@/lib/tire-data";

type SearchParams = Promise<{ code?: string; pos?: "front" | "rear" }>;

export default async function TireResult({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const sp = await searchParams; // <-- unwrap the Promise

  const raw = (sp.code ?? "").trim();
  const pos = (sp.pos === "rear" ? "rear" : "front") as "front" | "rear";

  if (!raw) redirect("/service/tire");

  const pair = getPsiPair(raw);

  if (!pair) {
    return (
      <main className="min-h-dvh p-6">
        <div className="mx-auto w-full max-w-3xl">
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
            <h1 className="mb-2 text-xl font-semibold text-red-700">
              Unsupported tire code
            </h1>
            <p className="mb-4 text-red-700/90">
              We couldn’t find <span className="font-mono">{raw}</span> in the
              approved list. Please go back and try another code.
            </p>
            <Link
              href="/service/tire"
              className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 font-medium text-slate-700 shadow-sm hover:bg-slate-50"
            >
              <span className="material-symbols-rounded text-base">
                arrow_back
              </span>
              Back to input
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const recommended = pos === "front" ? pair.front : pair.rear;

  return (
    <main className="min-h-dvh p-6">
      <div className="mx-auto w-full max-w-5xl">
        <div className="mb-6 flex items-center justify-between">
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

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-10">
          <div className="mb-6 grid place-items-center gap-2 text-center">
            <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-indigo-500/15 text-indigo-600">
              <span className="material-symbols-rounded text-[26px]">
                tire_repair
              </span>
            </span>
            <h1 className="text-3xl font-semibold text-indigo-700">
              PSI Recommendation
            </h1>
            <p className="max-w-2xl text-slate-500">
              Based on your tire code and position
            </p>
          </div>

          <div className="mx-auto max-w-3xl space-y-6">
            <div className="grid gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4 sm:grid-cols-3">
              <div>
                <p className="text-sm text-slate-500">Tire Code</p>
                <p className="font-semibold text-slate-800">{raw}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Position</p>
                <p className="font-semibold capitalize text-slate-800">{pos}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Recommended</p>
                <p className="text-2xl font-bold text-indigo-700">
                  {recommended} PSI
                </p>
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-4">
              <p className="text-sm text-slate-600">
                Exact values come from the AirPumpVendo reference tables for
                Cars, Motorcycles, and Bicycles.
              </p>
            </div>

            <div className="flex flex-wrap gap-3 pt-2">
              <Link
                href="/service/tire"
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 font-medium text-slate-700 shadow-sm hover:bg-slate-50"
              >
                <span className="material-symbols-rounded text-base">edit</span>
                Edit Input
              </Link>

              <Link
                href="/select-service"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-2 font-semibold text-slate-50 shadow-sm hover:bg-slate-800"
              >
                <span className="material-symbols-rounded text-base">home</span>
                Back to Services
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
