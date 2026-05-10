import { useEffect, useState, useRef } from "react";
import axios from "axios";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [highlighted, setHighlighted] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const previousOrdersRef = useRef([]);
  const audioRef = useRef(null);

  const statusColors = {
    pending: "#facc15",
    accepted: "#3b82f6",
    preparing: "#fb923c",
    cooking: "#ef4444",
    ready: "#22c55e",
    out_for_delivery: "#8b5cf6",
    delivered: "#16a34a",
    cancelled: "#6b7280",
  };

  const statusIcons = {
    pending: "⏳",
    accepted: "👍",
    preparing: "🧑‍🍳",
    cooking: "🔥",
    ready: "✔️",
    out_for_delivery: "🚗",
    delivered: "📦",
    cancelled: "❌",
  };

  const statusOrder = [
    "pending",
    "accepted",
    "preparing",
    "cooking",
    "ready",
    "out_for_delivery",
    "delivered",
  ];

  const getProgressPercent = (status) => {
    const index = statusOrder.indexOf(status);
    if (index === -1) return 0;
    return ((index + 1) / statusOrder.length) * 100;
  };

  const fetchOrders = async () => {
    try {
      const res = await axios.get("http://localhost:4000/api/orders");
      const newOrders = res.data.orders.sort((a, b) => b.id - a.id);

      const previousOrders = previousOrdersRef.current;

      if (previousOrders.length > 0 && newOrders.length > previousOrders.length) {
        const newOrderIds = newOrders
          .filter((o) => !previousOrders.some((p) => p.id === o.id))
          .map((o) => o.id);

        if (audioRef.current) {
          audioRef.current.play().catch(() => {});
        }

        setHighlighted(newOrderIds);
        setTimeout(() => setHighlighted([]), 2000);
      }

      previousOrdersRef.current = newOrders;
      setOrders(newOrders);
      setLoading(false);
      setError(null);
    } catch (err) {
      setError("Failed to load orders");
      setLoading(false);
    }
  };

  useEffect(() => {
    audioRef.current = new Audio("/ding.mp3");

    fetchOrders();
    const interval = setInterval(fetchOrders, 5000);

    return () => clearInterval(interval);
  }, []);

  const updateStatus = async (id, status) => {
    await axios.put(`http://localhost:4000/api/orders/${id}/status`, { status });
    fetchOrders();
  };

  const deleteOrder = async (id) => {
    await axios.delete(`http://localhost:4000/api/orders/${id}`);
    fetchOrders();
  };

  if (loading) {
    return (
      <div style={{ padding: "20px" }}>
        <h1>Loading orders…</h1>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: "20px", color: "red" }}>
        <h1>{error}</h1>
        <button onClick={fetchOrders}>Retry</button>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div style={{ padding: "20px" }}>
        <h1>No orders yet</h1>
      </div>
    );
  }

  // Filtering + search
  const filteredOrders = orders.filter((order) => {
    const matchesStatus =
      statusFilter === "all" ? true : order.status === statusFilter;

    const term = searchTerm.toLowerCase().trim();
    const matchesSearch =
      term === "" ||
      String(order.id).includes(term) ||
      (order.customer_name || "").toLowerCase().includes(term) ||
      (order.customer_phone || "").toLowerCase().includes(term) ||
      (order.customer_address || "").toLowerCase().includes(term);

    return matchesStatus && matchesSearch;
  });

  const totalOrders = orders.length;
  const activeOrders = orders.filter(
    (o) =>
      o.status !== "delivered" &&
      o.status !== "cancelled"
  ).length;
  const deliveredOrders = orders.filter((o) => o.status === "delivered").length;

  return (
    <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
      <h1 style={{ fontSize: "28px", fontWeight: "bold" }}>Orders</h1>

      {/* Top controls: stats + search + filter */}
      <div
        style={{
          marginTop: "10px",
          display: "flex",
          flexWrap: "wrap",
          gap: "10px",
          alignItems: "center",
        }}
      >
        <button
          onClick={fetchOrders}
          style={{
            padding: "8px 16px",
            background: "#2563eb",
            color: "white",
            borderRadius: "6px",
            border: "none",
            cursor: "pointer",
          }}
        >
          Refresh
        </button>

        <div
          style={{
            display: "flex",
            gap: "10px",
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <span style={{ fontSize: "14px" }}>
            <strong>Total:</strong> {totalOrders}
          </span>
          <span style={{ fontSize: "14px" }}>
            <strong>Active:</strong> {activeOrders}
          </span>
          <span style={{ fontSize: "14px" }}>
            <strong>Delivered:</strong> {deliveredOrders}
          </span>
        </div>

        <input
          type="text"
          placeholder="Search by name, phone, address, ID…"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            padding: "8px",
            borderRadius: "6px",
            border: "1px solid #d1d5db",
            minWidth: "260px",
            flex: "1 1 260px",
          }}
        />

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={{
            padding: "8px",
            borderRadius: "6px",
            border: "1px solid #d1d5db",
          }}
        >
          <option value="all">All statuses</option>
          <option value="pending">Pending</option>
          <option value="accepted">Accepted</option>
          <option value="preparing">Preparing</option>
          <option value="cooking">Cooking</option>
          <option value="ready">Ready</option>
          <option value="out_for_delivery">Out for delivery</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      <div style={{ marginTop: "20px" }}>
        {filteredOrders.length === 0 && (
          <p>No orders match your filters.</p>
        )}

        {filteredOrders.map((order) => (
          <div
            key={order.id}
            style={{
              padding: "16px",
              border: "1px solid #ddd",
              borderRadius: "8px",
              marginBottom: "16px",
              background: highlighted.includes(order.id)
                ? "#fff3cd"
                : "#f9fafb",
              transition: "background 0.5s ease",
            }}
          >
            <h2
              style={{
                fontSize: "20px",
                fontWeight: "600",
                color: statusColors[order.status],
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <span>{statusIcons[order.status]}</span>
              Order #{order.id} — {order.status}
            </h2>

            <span
              style={{
                display: "inline-block",
                padding: "4px 10px",
                background: statusColors[order.status],
                color: "white",
                borderRadius: "12px",
                fontSize: "12px",
                marginBottom: "10px",
              }}
            >
              {order.status}
            </span>

            <div
              style={{
                width: "100%",
                height: "8px",
                background: "#e5e7eb",
                borderRadius: "4px",
                marginBottom: "12px",
              }}
            >
              <div
                style={{
                  width: `${getProgressPercent(order.status)}%`,
                  height: "100%",
                  background: statusColors[order.status],
                  borderRadius: "4px",
                  transition: "width 0.4s ease",
                }}
              ></div>
            </div>

            <p><strong>Name:</strong> {order.customer_name}</p>
            <p><strong>Phone:</strong> {order.customer_phone}</p>
            <p><strong>Address:</strong> {order.customer_address}</p>

            <p style={{ marginTop: "10px" }}><strong>Items:</strong></p>
            <pre
              style={{
                background: "#f3f4f6",
                padding: "10px",
                borderRadius: "6px",
              }}
            >
              {JSON.stringify(order.items, null, 2)}
            </pre>

            <p><strong>Total:</strong> €{order.total_price}</p>

            <div
              style={{
                marginTop: "12px",
                display: "flex",
                gap: "8px",
                flexWrap: "wrap",
              }}
            >
              {[
                "pending",
                "accepted",
                "preparing",
                "cooking",
                "ready",
                "out_for_delivery",
                "delivered",
                "cancelled",
              ].map((s) => (
                <button
                  key={s}
                  onClick={() => updateStatus(order.id, s)}
                  style={{
                    padding: "6px 12px",
                    background: statusColors[s],
                    color: "white",
                    borderRadius: "6px",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  {statusIcons[s]} {s}
                </button>
              ))}

              <button
                onClick={() => deleteOrder(order.id)}
                style={{
                  padding: "6px 12px",
                  background: "#dc2626",
                  color: "white",
                  borderRadius: "6px",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                ❌ Delete
              </button>
            </div>

            <div style={{ marginTop: "12px", fontSize: "14px" }}>
              <p>Pending: {order.pending_at || "—"}</p>
              <p>Accepted: {order.accepted_at || "—"}</p>
              <p>Preparing: {order.preparing_at || "—"}</p>
              <p>Cooking: {order.cooking_at || "—"}</p>
              <p>Ready: {order.ready_at || "—"}</p>
              <p>Out for delivery: {order.out_for_delivery_at || "—"}</p>
              <p>Delivered: {order.delivered_at || "—"}</p>
              <p>Cancelled: {order.cancelled_at || "—"}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


{/* Delivery Details */}
<div
  style={{
    marginTop: "16px",
    padding: "12px",
    background: "#eef2ff",
    borderRadius: "8px",
  }}
>
  <h3 style={{ fontWeight: "600", marginBottom: "8px" }}>
    Delivery Details
  </h3>

  <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
    <input
      type="text"
      placeholder="Driver name"
      defaultValue={order.driver_name || ""}
      onChange={(e) => (order.driver_name = e.target.value)}
      style={{
        padding: "8px",
        borderRadius: "6px",
        border: "1px solid #ccc",
        minWidth: "180px",
      }}
    />

    <input
      type="datetime-local"
      defaultValue={
        order.estimated_delivery_time
          ? order.estimated_delivery_time.slice(0, 16)
          : ""
      }
      onChange={(e) => (order.estimated_delivery_time = e.target.value)}
      style={{
        padding: "8px",
        borderRadius: "6px",
        border: "1px solid #ccc",
        minWidth: "200px",
      }}
    />

    <button
      onClick={() =>
        axios
          .put(`http://localhost:4000/api/orders/${order.id}/extra`, {
            driver_name: order.driver_name,
            estimated_delivery_time: order.estimated_delivery_time,
          })
          .then(fetchOrders)
      }
      style={{
        padding: "8px 14px",
        background: "#10b981",
        color: "white",
        borderRadius: "6px",
        border: "none",
        cursor: "pointer",
      }}
    >
      Save
    </button>
  </div>
</div>
