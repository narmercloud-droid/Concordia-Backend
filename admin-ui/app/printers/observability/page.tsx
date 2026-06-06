"use client";

import { useEffect, useState } from "react";

export default function PrinterObservabilityPage() {
  const [traces, setTraces] = useState([]);
  const [health, setHealth] = useState([]);
  const [anomalies, setAnomalies] = useState([]);

  const load = () => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/printer/observability/traces`)
      .then(res => res.json())
      .then(setTraces);

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/printer/observability/health`)
      .then(res => res.json())
      .then(setHealth);

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/printer/observability/anomalies`)
      .then(res => res.json())
      .then(setAnomalies);
  };

  useEffect(() => {
    load();
    const interval = setInterval(load, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Printer Observability</h1>

      <section>
        <h2 className="text-xl font-semibold">Health Scores</h2>
        <ul className="list-disc ml-6">
          {health.map(h => (
            <li key={h.id}>
              {h.printerId}: {h.score}
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-semibold">Recent Traces</h2>
        <ul className="list-disc ml-6">
          {traces.map(t => (
            <li key={t.id}>
              {t.event} — {t.printerId} — {t.durationMs || "n/a"}ms
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-semibold">Anomalies</h2>
        <ul className="list-disc ml-6">
          {anomalies.map(a => (
            <li key={a.id}>
              {a.type} — {a.printerId} — severity {a.severity}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
