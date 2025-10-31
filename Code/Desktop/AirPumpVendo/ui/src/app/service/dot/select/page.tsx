import Link from "next/link";

export default function DotSelect() {
  return (
    <main className="min-h-dvh grid place-items-center p-6 text-center">
      <div className="max-w-xl">
        <h1 className="mb-2 text-2xl font-semibold text-slate-800">
          Select DOT Code
        </h1>
        <p className="text-slate-600">
          Next step: show common DOT patterns and/or a keypad/list to pick the
          DOT code.
        </p>
        <Link
          href="/service/dot"
          className="mt-5 inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 font-medium text-slate-700 shadow-sm hover:bg-slate-50"
        >
          <span className="material-symbols-rounded text-base">arrow_back</span>
          Back
        </Link>
      </div>
    </main>
  );
}
