import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <div
      style={{
        width: "220px",
        background: "#1f2937",
        color: "white",
        height: "100vh",
        padding: "20px",
        boxSizing: "border-box",
        position: "fixed",
        left: 0,
        top: 0,
      }}
    >
      <h2 style={{ fontSize: "22px", marginBottom: "20px" }}>Dashboard</h2>

      <nav style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        <Link to="/" style={{ color: "white", textDecoration: "none" }}>
          📦 Orders
        </Link>

        <Link to="/menu" style={{ color: "white", textDecoration: "none" }}>
          🍽️ Menu Items
        </Link>

        <Link to="/settings" style={{ color: "white", textDecoration: "none" }}>
          ⚙️ Settings
        </Link>
      </nav>
    </div>
  );
}
