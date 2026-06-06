"use client";

import { useEffect, useState } from "react";

export default function TerminalDashboard() {
  const [terminals, setTerminals] = useState([]);
  const [errors, setErrors] = useState([]);

  const load = () => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/terminals`)
      .then(res => res.json())
      .then(setTerminals);

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/terminals/errors`)
      .then(res => res.json())
      .then(setErrors);
  };

  useEffect(() => {
    load();
    const interval = setInterval(load, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Terminal Dashboard</h1>

      <section>
        <h2 className="text-xl font-semibold">Terminals</h2>
        <ul className="list-disc ml-6">
          {terminals.map(t => (
            <li key={t.id}>
              Terminal {t.terminalId} — {t.online ? "Online" : "Offline"} — Kitchen: {t.assignedKitchen || "None"}
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-semibold">Errors</h2>
        <ul className="list-disc ml-6">
          {errors.map(e => (
            <li key={e.id}>
              {e.message} — severity {e.severity}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
