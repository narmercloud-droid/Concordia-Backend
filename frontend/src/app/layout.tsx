import dynamic from "next/dynamic";
import "./globals.css";
import Link from "next/link";

const CartSidebar = dynamic(() => import("../components/CartSidebar.js"), {
  ssr: false,
  loading: () => (
    <div className="sticky top-6 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="text-lg font-semibold text-slate-900">Your cart</div>
      <p className="mt-3 text-sm text-slate-500">Loading cart…</p>
    </div>
  )
});

export const metadata = {
  title: "Concordia",
  description: "Food ordering with menu and AI chat"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 text-slate-900">
        <div className="border-b bg-white shadow-sm">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
            <div className="text-lg font-semibold uppercase tracking-[0.2em] text-slate-800">Concordia</div>
            <nav className="flex items-center gap-4 text-slate-600">
              <Link href="/" className="hover:text-slate-900">Home</Link>
              <Link href="/menu" className="hover:text-slate-900">Menu</Link>
              <Link href="/chat" className="hover:text-slate-900">Chat</Link>
              <Link href="/cart" className="hover:text-slate-900">Cart</Link>
              <Link href="/admin/login" className="hover:text-slate-900">Admin</Link>
            </nav>
          </div>
        </div>
        <div className="mx-auto flex max-w-7xl gap-6 px-4 py-6 sm:px-6">
          <main className="min-h-[calc(100vh-96px)] w-full rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:w-[65%]">
            {children}
          </main>
          <aside className="hidden w-96 xl:block">
            <CartSidebar />
          </aside>
        </div>
      </body>
    </html>
  );
}
