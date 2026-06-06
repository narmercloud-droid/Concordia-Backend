import Link from "next/link";

export default function KDSLandingPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-semibold text-slate-900">Kitchen Display System</h1>
        <p className="mt-3 text-slate-600">Manage orders and kitchen workflow from your branch.</p>
        <div className="mt-8">
          <Link href="/kds/login" className="inline-flex rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800">
            Go to KDS login
          </Link>
        </div>
      </div>
    </div>
  );
}
