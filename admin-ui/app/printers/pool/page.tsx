"use client";

import { useEffect, useState } from "react";

export default function PrinterPoolPage() {
  const [printers, setPrinters] = useState([]);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/printer/status`)
      .then(res => res.json())
      .then(data => {
        const list = [];
        Object.keys(data).forEach(k => {
          if (Array.isArray(data[k])) {
            data[k].forEach(p => list.push({ kitchen: k, ...p }));
          }
        });
        setPrinters(list);
      });
  }, []);

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-3xl font-bold">Printer Pool</h1>

      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 border">Kitchen</th>
            <th className="p-2 border">Printer ID</th>
            <th className="p-2 border">Online</th>
            <th className="p-2 border">Last Check</th>
            <th className="p-2 border">Last Error</th>
          </tr>
        </thead>
        <tbody>
          {printers.map((p, idx) => (
            <tr key={idx} className="border">
              <td className="p-2 border">{p.kitchen}</td>
              <td className="p-2 border">{p.id}</td>
              <td className="p-2 border">{p.status.online ? "Yes" : "No"}</td>
              <td className="p-2 border">{p.status.lastCheck}</td>
              <td className="p-2 border">{p.status.lastError || "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
