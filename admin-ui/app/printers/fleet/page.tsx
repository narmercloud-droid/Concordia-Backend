"use client";

import { useEffect, useState } from "react";

export default function PrinterFleetPage() {
  const [fleet, setFleet] = useState([]);

  const load = () => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/printer/fleet`)
      .then(res => res.json())
      .then(setFleet);
  };

  const updatePolicy = async (printerId, policy) => {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/printer/fleet/policy/${printerId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ policy })
    });
    load();
  };

  const updateFirmware = async (printerId, version) => {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/printer/fleet/firmware/${printerId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ version })
    });
    load();
  };

  const sendCommand = async (printerId, command) => {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/printer/fleet/command/${printerId}/${command}`, {
      method: "POST"
    });
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-3xl font-bold">Printer Fleet Management</h1>

      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 border">Printer ID</th>
            <th className="p-2 border">Group</th>
            <th className="p-2 border">Policy</th>
            <th className="p-2 border">Firmware</th>
            <th className="p-2 border">Commands</th>
          </tr>
        </thead>
        <tbody>
          {fleet.map(p => (
            <tr key={p.id} className="border">
              <td className="p-2 border">{p.printerId}</td>
              <td className="p-2 border">{p.group}</td>
              <td className="p-2 border">
                <input
                  className="border p-1"
                  defaultValue={p.policy || ""}
                  onBlur={(e) => updatePolicy(p.printerId, e.target.value)}
                />
              </td>
              <td className="p-2 border">
                <input
                  className="border p-1"
                  defaultValue={p.firmware || ""}
                  onBlur={(e) => updateFirmware(p.printerId, e.target.value)}
                />
              </td>
              <td className="p-2 border space-x-2">
                <button onClick={() => sendCommand(p.printerId, "restart")} className="bg-blue-600 text-white px-2 py-1 rounded">Restart</button>
                <button onClick={() => sendCommand(p.printerId, "reset")} className="bg-yellow-600 text-white px-2 py-1 rounded">Reset</button>
                <button onClick={() => sendCommand(p.printerId, "test")} className="bg-green-600 text-white px-2 py-1 rounded">Test</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
