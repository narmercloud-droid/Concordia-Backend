"use client";

import { useEffect, useState } from "react";

export default function PrinterAnalyticsPage() {
  const [data, setData] = useState(null);

  const load = () => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/printer/analytics`)
      .then(res => res.json())
      .then(setData);
  };

  useEffect(() => {
    load();
    const interval = setInterval(load, 5000);
    return () => clearInterval(interval);
  }, []);

  if (!data) return <div className="p-6">Loading…</div>;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Printer Analytics</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        <div className="p-4 bg-gray-100 rounded shadow">
          <h2 className="font-semibold">Total Jobs</h2>
          <p>{data.totalJobs}</p>
        </div>

        <div className="p-4 bg-gray-100 rounded shadow">
          <h2 className="font-semibold">Success</h2>
          <p>{data.success}</p>
        </div>

        <div className="p-4 bg-gray-100 rounded shadow">
          <h2 className="font-semibold">Failed</h2>
          <p>{data.failed}</p>
        </div>

        <div className="p-4 bg-gray-100 rounded shadow">
          <h2 className="font-semibold">Uptime</h2>
          <p>{(data.uptime * 100).toFixed(2)}%</p>
        </div>

        <div className="p-4 bg-gray-100 rounded shadow">
          <h2 className="font-semibold">Avg Print Time</h2>
          <p>{data.avgDuration} ms</p>
        </div>

        <div className="p-4 bg-gray-100 rounded shadow">
          <h2 className="font-semibold">Jobs (Last 24h)</h2>
          <p>{data.jobsLast24h}</p>
        </div>

      </div>
    </div>
  );
}
