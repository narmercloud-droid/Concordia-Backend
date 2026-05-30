"use client";

import { useEffect, useState } from "react";

export default function PrinterStatusPage() {
  const [status, setStatus] = useState({});

  const load = () => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/printer/status`)
      .then(res => res.json())
      .then(data => setStatus(data));
  };

  const testPrint = async (k) => {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/printer/test/${k}`, {
      method: "POST"
    });
    alert(`Test print sent to Kitchen ${k}`);
  };

  useEffect(() => {
    load();
    const interval = setInterval(load, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-3xl font-bold">Printer Status</h1>

      {Object.keys(status).map((k) => (
        <div key={k} className="p-4 bg-gray-100 rounded shadow">
          <h2 className="text-xl font-semibold">Kitchen {k}</h2>
          <p>Online: {status[k].online ? "Yes" : "No"}</p>
          <p>Last Check: {status[k].lastCheck}</p>
          <p>Last Success: {status[k].lastSuccess}</p>
          <p>Last Error: {status[k].lastError}</p>
          <button
            onClick={() => testPrint(k)}
            className="mt-2 bg-blue-600 text-white py-1 px-3 rounded"
          >
            Test Print
          </button>
        </div>
      ))}
    </div>
  );
}
