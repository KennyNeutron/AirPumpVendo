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
  if (!pair) {
    redirect("/service/tire"); // guard: unknown code -> back to input
  }

  const recommended = pos === "front" ? pair.front : pair.rear;

  const posLabel = pos === "front" ? "Front Tire" : "Rear Tire";
  const why =
    pos === "front"
      ? "Front tires use 2 PSI less for better steering response and road contact."
      : "Rear tires use 2 PSI more to better support passenger/load weight.";

  return (
    <main className="min-h-dvh p-6">
      <div className="mx-auto w-full max-w-5xl">
        {/* Header like your mock */}
        <div className="mb-6 grid place-items-center gap-3 text-center">
          <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-blue-500/15 text-blue-600">
            <span className="material-symbols-rounded text-[26px]">info</span>
          </span>
          <h1 className="text-3xl font-semibold text-indigo-700">
            Enter Your Tire Code
          </h1>
          <p className="max-w-2xl text-slate-500">
            Enter your tire code and select tire position to get the recommended
            PSI
          </p>
        </div>

        {/* Success panel */}
        <section className="rounded-2xl border border-emerald-300 bg-emerald-50 p-6 shadow-sm md:p-8">
          <div className="mb-5 flex items-center gap-2 text-emerald-700">
            <span className="material-symbols-rounded">check_circle</span>
            <span className="font-medium">PSI Recommendation Ready</span>
          </div>

          {/* Stats tiles */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-slate-200 bg-white p-5">
              <p className="text-sm text-slate-500">Tire Code</p>
              <p className="mt-1 text-xl font-semibold text-slate-800">{raw}</p>
              <p className="mt-3 text-sm text-slate-500">Position</p>
              <p className="mt-1 font-medium text-indigo-600">{posLabel}</p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-5">
              <p className="text-sm text-slate-500">Recommended PSI</p>
              <p className="mt-1 text-3xl font-bold text-emerald-600">
                {recommended}
              </p>
              <p className="mt-3 text-sm text-slate-500">Service Cost</p>
              <p className="mt-1 font-medium text-slate-800">₱10</p>
            </div>
          </div>

          {/* Why box */}
          <div className="mt-5 rounded-xl border border-slate-200 bg-indigo-50 p-4">
            <p className="mb-1 font-semibold text-indigo-900">Why this PSI?</p>
            <p className="text-sm text-indigo-900/80">{why}</p>
          </div>

          {/* Next actions */}
          <div className="mt-7 text-center">
            <p className="mb-4 font-medium text-slate-700">
              What would you like to do next?
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              <Link
                href="/service/dot"
                className="block rounded-lg border border-slate-300 bg-white p-4 text-slate-800 shadow-sm hover:bg-slate-50"
              >
                <div className="flex items-center justify-center gap-2 font-semibold">
                  <span className="material-symbols-rounded text-blue-600">
                    shield
                  </span>
                  <span>Check DOT Code</span>
                </div>
                <p className="mt-1 text-center text-sm text-slate-500">
                  Tire Safety Check - ₱15
                </p>
              </Link>

              <Link
                href={`/service/inflation?code=${encodeURIComponent(
                  raw
                )}&pos=${pos}&psi=${recommended}`}
                className="block rounded-lg bg-slate-900 p-4 text-slate-50 shadow-sm hover:bg-slate-800"
              >
                <div className="flex items-center justify-center gap-2 font-semibold">
                  <span className="material-symbols-rounded">tire_repair</span>
                  <span>Proceed to Tire Inflation</span>
                </div>
                <p className="mt-1 text-center text-sm text-slate-300">₱20</p>
              </Link>
            </div>

            <Link
              href="/service/tire"
              className="mt-5 inline-block text-sm font-medium text-indigo-700 hover:underline"
            >
              Enter Different Tire Code
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
