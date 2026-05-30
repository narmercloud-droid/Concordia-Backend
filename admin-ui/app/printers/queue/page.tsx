"use client";

import { useEffect, useState } from "react";

export default function PrinterQueuePage() {
  const [jobs, setJobs] = useState([]);

  const load = () => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/printer/queue`)
      .then(res => res.json())
      .then(data => setJobs(data));
  };

  useEffect(() => {
    load();
    const interval = setInterval(load, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-3xl font-bold">Printer Queue</h1>

      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 border">Kitchen</th>
            <th className="p-2 border">Status</th>
            <th className="p-2 border">Attempts</th>
            <th className="p-2 border">Last Error</th>
            <th className="p-2 border">Created</th>
          </tr>
        </thead>
        <tbody>
          {jobs.map(job => (
            <tr key={job.id} className="border">
              <td className="p-2 border">{job.kitchen}</td>
              <td className="p-2 border">{job.status}</td>
              <td className="p-2 border">{job.attempts}</td>
              <td className="p-2 border">{job.lastError || "-"}</td>
              <td className="p-2 border">{new Date(job.createdAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
