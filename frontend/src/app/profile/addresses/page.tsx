import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";

async function fetchAddresses(token: string) {
  const response = await fetch("http://localhost:3001/customer/addresses", {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    cache: "no-store"
  });

  if (!response.ok) throw new Error("Unable to load addresses");
  return response.json();
}

export default async function AddressesPage() {
  const session = cookies().get("session")?.value;
  if (!session) {
    redirect("/login");
  }

  const data = await fetchAddresses(session);
  const addresses = data || [];

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Addresses</h1>
          <p className="mt-2 text-slate-600">Manage saved delivery addresses for faster checkout.</p>
        </div>
        <Link href="/profile/addresses/new" className="rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800">
          Add address
        </Link>
      </div>

      {addresses.length ? (
        <div className="space-y-4">
          {addresses.map((address: any) => (
            <div key={address.id} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <div className="text-lg font-semibold text-slate-900">{address.label}</div>
                  <p className="mt-2 text-slate-600">{address.street}, {address.city}, {address.postalCode}</p>
                  {address.instructions ? <p className="mt-2 text-sm text-slate-500">Instructions: {address.instructions}</p> : null}
                </div>
                <div className="flex gap-2">
                  <Link href={`/profile/addresses/${address.id}/edit`} className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm text-slate-900 hover:bg-slate-50">
                    Edit
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 text-slate-600 shadow-sm">
          No saved addresses yet. Add one to speed up checkout.
        </div>
      )}
    </div>
  );
}
