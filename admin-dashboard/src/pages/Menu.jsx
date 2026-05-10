import { useEffect, useState } from "react";
import axios from "axios";

export default function Menu() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    name: "",
    price: "",
    category: "",
    available: true,
  });

  const fetchItems = async () => {
    const res = await axios.get("http://localhost:4000/api/menu");
    setItems(res.data.items);
    setLoading(false);
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post("http://localhost:4000/api/menu", form);
    setForm({ name: "", price: "", category: "", available: true });
    fetchItems();
  };

  const deleteItem = async (id) => {
    await axios.delete(`http://localhost:4000/api/menu/${id}`);
    fetchItems();
  };

  const toggleAvailability = async (id, available) => {
    await axios.put(`http://localhost:4000/api/menu/${id}`, { available });
    fetchItems();
  };

  if (loading) return <h1>Loading menu…</h1>;

  return (
    <div style={{ padding: "20px" }}>
      <h1 style={{ fontSize: "28px", fontWeight: "bold" }}>Menu Management</h1>

      {/* Add Item Form */}
      <form
        onSubmit={handleSubmit}
        style={{
          marginTop: "20px",
          padding: "20px",
          border: "1px solid #ddd",
          borderRadius: "8px",
          maxWidth: "400px",
        }}
      >
        <h2>Add New Item</h2>

        <input
          type="text"
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
          style={{ width: "100%", padding: "8px", marginTop: "10px" }}
        />

        <input
          type="number"
          placeholder="Price (€)"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
          required
          style={{ width: "100%", padding: "8px", marginTop: "10px" }}
        />

        <input
          type="text"
          placeholder="Category"
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
          required
          style={{ width: "100%", padding: "8px", marginTop: "10px" }}
        />

        <button
          type="submit"
          style={{
            marginTop: "10px",
            padding: "10px",
            background: "#2563eb",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          Add Item
        </button>
      </form>

      {/* Menu List */}
      <div style={{ marginTop: "30px" }}>
        <h2>Menu Items</h2>

        {items.map((item) => (
          <div
            key={item.id}
            style={{
              padding: "16px",
              border: "1px solid #ddd",
              borderRadius: "8px",
              marginBottom: "16px",
              background: "#f9fafb",
            }}
          >
            <h3 style={{ fontSize: "20px", fontWeight: "600" }}>
              {item.name} — €{item.price}
            </h3>

            <p>Category: {item.category}</p>
            <p>Status: {item.available ? "Available" : "Unavailable"}</p>

            <div style={{ marginTop: "10px", display: "flex", gap: "10px" }}>
              <button
                onClick={() => toggleAvailability(item.id, !item.available)}
                style={{
                  padding: "6px 12px",
                  background: item.available ? "#6b7280" : "#22c55e",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                }}
              >
                {item.available ? "Disable" : "Enable"}
              </button>

              <button
                onClick={() => deleteItem(item.id)}
                style={{
                  padding: "6px 12px",
                  background: "#dc2626",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                }}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
