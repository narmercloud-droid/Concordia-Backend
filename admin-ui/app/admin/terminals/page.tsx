"use client";

import { useEffect, useState } from "react";

export default function AdminTerminalsPage() {
  const [terminals, setTerminals] = useState([]);

  const load = () => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/tools/terminals`)
      .then(res => res.json())
      .then(setTerminals);
  };

  useEffect(() => {
    load();
    const interval = setInterval(load, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Terminal Management</h1>

      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 border">Terminal</th>
            <th className="p-2 border">Branch</th>
            <th className="p-2 border">Online</th>
            <th className="p-2 border">Kitchen</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {terminals.map(t => (
            <tr key={t.id} className="border">
              <td className="p-2 border">{t.id}</td>
              <td className="p-2 border">{t.branchId}</td>
              <td className="p-2 border">{t.status?.online ? "Online" : "Offline"}</td>
              <td className="p-2 border">{t.status?.assignedKitchen || "None"}</td>
              <td className="p-2 border">
                <button className="bg-blue-600 text-white px-2 py-1 rounded">
                  Reset Token
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
