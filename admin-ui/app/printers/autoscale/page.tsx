"use client";

import { useEffect, useState } from "react";

export default function PrinterAutoscalePage() {
  const [virtual, setVirtual] = useState([]);

  const load = () => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/printer/status`)
      .then(res => res.json())
      .then(data => {
        const list = [];
        Object.keys(data).forEach(k => {
          if (Array.isArray(data[k])) {
            data[k]
              .filter(p => p.type === "virtual")
              .forEach(p => list.push({ kitchen: k, ...p }));
          }
        });
        setVirtual(list);
      });
  };

  useEffect(() => {
    load();
    const interval = setInterval(load, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-3xl font-bold">Printer Auto‑Scaling</h1>

      <p className="text-gray-600">
        Virtual printers are automatically created and removed based on queue load.
      </p>

      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 border">Kitchen</th>
            <th className="p-2 border">Instance ID</th>
            <th className="p-2 border">Status</th>
          </tr>
        </thead>
        <tbody>
          {virtual.map((p, idx) => (
            <tr key={idx} className="border">
              <td className="p-2 border">{p.kitchen}</td>
              <td className="p-2 border">{p.id}</td>
              <td className="p-2 border">Active</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
