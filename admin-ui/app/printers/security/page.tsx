"use client";

import { useEffect, useState } from "react";

export default function PrinterSecurityPage() {
  const [pending, setPending] = useState([]);

  const load = () => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/printer/security/pending`)
      .then(res => res.json())
      .then(setPending);
  };

  const approve = async (id) => {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/printer/security/approve/${id}`, {
      method: "POST"
    });
    load();
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-3xl font-bold">Printer Security</h1>

      <p className="text-gray-600">
        Approve or reject newly discovered printers.
      </p>

      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 border">Printer ID</th>
            <th className="p-2 border">Kitchen</th>
            <th className="p-2 border">IP</th>
            <th className="p-2 border">Approve</th>
          </tr>
        </thead>
        <tbody>
          {pending.map(p => (
            <tr key={p.id} className="border">
              <td className="p-2 border">{p.printerId}</td>
              <td className="p-2 border">{p.kitchen}</td>
              <td className="p-2 border">{p.ipAddress}</td>
              <td className="p-2 border">
                <button
                  onClick={() => approve(p.id)}
                  className="bg-green-600 text-white px-3 py-1 rounded"
                >
                  Approve
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
