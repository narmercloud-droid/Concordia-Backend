"use client";

import { useEffect, useState } from "react";

export default function PrinterDiscoveryPage() {
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
      <h1 className="text-3xl font-bold">Discovered Printers</h1>

      <p className="text-gray-600">
        Printers discovered via mDNS / Bonjour are automatically added to Kitchen B.
      </p>

      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 border">Kitchen</th>
            <th className="p-2 border">Printer ID</th>
            <th className="p-2 border">Host</th>
            <th className="p-2 border">Port</th>
          </tr>
        </thead>
        <tbody>
          {printers.map((p, idx) => (
            <tr key={idx} className="border">
              <td className="p-2 border">{p.kitchen}</td>
              <td className="p-2 border">{p.id}</td>
              <td className="p-2 border">{p.host}</td>
              <td className="p-2 border">{p.port}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
