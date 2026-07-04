"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { clientBackendJson } from "../../../lib/clientBackend.js";

type Branch = {
  id: string;
  name: string;
};

function getCookie(name: string) {
  return document.cookie.split(";").map(part => part.trim()).find(part => part.startsWith(`${name}=`))?.split("=")[1] || "";
}

export default function KDSLoginPage() {
  const [email, setEmail] = useState("");
  const [branchId, setBranchId] = useState("");
  const [branches, setBranches] = useState<Branch[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const storedBranch = getCookie("kdsBranchId");
    if (storedBranch) {
      router.push("/kds/orders");
      return;
    }

    clientBackendJson<Branch[]>("/search/branches")
      .then(data => {
        if (Array.isArray(data)) {
          setBranches(data);
          if (data.length) {
            setBranchId(data[0].id);
          }
        }
      })
      .catch(() => {
        setError("Unable to load branches. Enter a branch ID manually.");
      })
      .finally(() => setLoading(false));
  }, [router]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email.trim()) {
      setError("Please enter your staff email.");
      return;
    }
    if (!branchId.trim()) {
      setError("Please select a branch.");
      return;
    }

    document.cookie = `kdsBranchId=${encodeURIComponent(branchId)}; path=/; SameSite=Lax`;
    document.cookie = `kdsStaffEmail=${encodeURIComponent(email.trim())}; path=/; SameSite=Lax`;
    router.push("/kds/orders");
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-semibold text-slate-900">KDS login</h1>
        <p className="mt-3 text-slate-600">Sign in as kitchen staff and choose your branch to manage orders.</p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <label className="block text-sm font-medium text-slate-700">
            Staff email
            <input
              type="email"
              value={email}
              onChange={event => setEmail(event.target.value)}
              className="mt-2 w-full rounded-3xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none focus:border-slate-500"
              placeholder="staff@example.com"
              required
            />
          </label>

          <label className="block text-sm font-medium text-slate-700">
            Branch
            {loading ? (
              <div className="mt-2 text-sm text-slate-500">Loading branches…</div>
            ) : branches.length ? (
              <select
                value={branchId}
                onChange={event => setBranchId(event.target.value)}
                className="mt-2 w-full rounded-3xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-slate-500"
              >
                {branches.map(branch => (
                  <option key={branch.id} value={branch.id}>
                    {branch.name || branch.id}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type="text"
                value={branchId}
                onChange={event => setBranchId(event.target.value)}
                className="mt-2 w-full rounded-3xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none focus:border-slate-500"
                placeholder="Enter branch ID"
              />
            )}
          </label>

          {error ? <p className="text-sm text-red-600">{error}</p> : null}

          <button type="submit" className="w-full rounded-3xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800">
            Continue
          </button>
        </form>
      </div>
    </div>
  );
}
