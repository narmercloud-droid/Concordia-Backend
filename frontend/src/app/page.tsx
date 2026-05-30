import Link from "next/link";

export default function HomePage() {
  return (
    <div className="space-y-8">
      <section className="rounded-3xl border border-slate-200 bg-slate-50 p-10 shadow-sm">
        <div className="max-w-3xl space-y-4">
          <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Concordia</p>
          <h1 className="text-4xl font-semibold tracking-tight text-slate-900">Smart ordering for your favorite meals.</h1>
          <p className="text-lg leading-8 text-slate-600">
            Browse the menu, chat with the ordering assistant, and manage your cart in one intuitive experience.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/menu" className="rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800">
              Browse menu
            </Link>
            <Link href="/chat" className="rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-900 transition hover:border-slate-400">
              Talk to the AI assistant
            </Link>
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">Menu discovery</h2>
          <p className="mt-3 text-slate-600">Explore curated dishes, combos, and chef recommendations from our fresh kitchen.</p>
        </article>
        <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">AI shopping assistant</h2>
          <p className="mt-3 text-slate-600">Ask questions, get suggestions, or request dietary-friendly options instantly.</p>
        </article>
        <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">Fast checkout</h2>
          <p className="mt-3 text-slate-600">Review your items, submit your order, and track it in real time.</p>
        </article>
      </section>
    </div>
  );
}
