"use client";

import { useEffect, useState } from "react";

export default function PrinterCloudPage() {
  const [printers, setPrinters] = useState([]);

  const load = () => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/printer/cloud`)
      .then(res => res.json())
      .then(setPrinters);
  };

  useEffect(() => {
    load();
    const interval = setInterval(load, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-3xl font-bold">Cloud Printer Registry</h1>

      <p className="text-gray-600">
        All printers from all branches synchronized to the cloud.
      </p>

      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 border">Branch</th>
            <th className="p-2 border">Printer ID</th>
            <th className="p-2 border">Kitchen</th>
            <th className="p-2 border">IP</th>
            <th className="p-2 border">Type</th>
            <th className="p-2 border">Online</th>
          </tr>
        </thead>
        <tbody>
          {printers.map(p => (
            <tr key={p.id} className="border">
              <td className="p-2 border">{p.branchId}</td>
              <td className="p-2 border">{p.printerId}</td>
              <td className="p-2 border">{p.kitchen}</td>
              <td className="p-2 border">{p.ipAddress}</td>
              <td className="p-2 border">{p.type}</td>
              <td className="p-2 border">{p.online ? "Yes" : "No"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
