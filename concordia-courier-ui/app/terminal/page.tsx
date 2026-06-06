"use client";

import { useState } from "react";

export default function TerminalLogin() {
  const [branchId, setBranchId] = useState("");

  const enter = () => {
    if (!branchId) return;
    window.location.href = `/terminal/${branchId}`;
  };

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Terminal Login</h1>

      <input
        className="border p-2 w-full"
        placeholder="Branch ID"
        value={branchId}
        onChange={(e) => setBranchId(e.target.value)}
      />

      <button
        onClick={enter}
        className="bg-blue-600 text-white py-2 px-4 rounded w-full"
      >
        Enter Terminal
      </button>
    </div>
  );
}
