"use client";

import { useEffect, useState } from "react";

export default function MenuKitchenAssignment() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/menu`)
      .then(res => res.json())
      .then(data => setItems(data));
  }, []);

  const updateKitchen = async (itemId, kitchen) => {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/kitchen/item/${itemId}/kitchen`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ kitchen })
    });

    setItems(prev =>
      prev.map(i =>
        i.id === itemId ? { ...i, kitchen } : i
      )
    );
  };

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-3xl font-bold">Menu — Kitchen Assignment</h1>

      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 border">Item</th>
            <th className="p-2 border">Kitchen</th>
          </tr>
        </thead>
        <tbody>
          {items.map(item => (
            <tr key={item.id} className="border">
              <td className="p-2 border">{item.name}</td>
              <td className="p-2 border">
                <select
                  value={item.kitchen}
                  onChange={(e) => updateKitchen(item.id, e.target.value)}
                  className="border p-1"
                >
                  <option value="A">Kitchen A</option>
                  <option value="B">Kitchen B</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
