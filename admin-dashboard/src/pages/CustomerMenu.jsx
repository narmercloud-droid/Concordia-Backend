import { useEffect, useState } from "react";
import axios from "axios";

export default function CustomerMenu() {
  const [items, setItems] = useState([]);
  const [cart, setCart] = useState([]);

  // Checkout form state
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:4000/api/menu")
      .then((res) => setItems(res.data.items.filter((i) => i.available)))
      .catch((err) => console.error(err));
  }, []);

  const addToCart = (item) => {
    setCart((prev) => [...prev, item]);
  };

  const total = cart.reduce((sum, item) => sum + Number(item.price), 0);

  const handleCheckout = async (e) => {
    e.preventDefault();

    const order = {
      name,
      phone,
      address,
      items: cart.map((item) => ({
        qty: 1,
        name: item.name,
      })),
      total,
    };

    // Create order ONCE
    const response = await axios.post("http://localhost:4000/api/orders", order);

    // Redirect customer to tracking page
    window.location.href = `/track/${response.data.order.id}`;
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1 style={{ fontSize: "28px", fontWeight: "bold" }}>Customer Menu</h1>

      {/* MENU ITEMS */}
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

          <button
            onClick={() => addToCart(item)}
            style={{
              marginTop: "10px",
              padding: "8px 16px",
              background: "#22c55e",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
            }}
          >
            Add to Cart
          </button>
        </div>
      ))}

      {/* CART */}
      <div
        style={{
          marginTop: "40px",
          padding: "20px",
          border: "1px solid #ddd",
          borderRadius: "8px",
        }}
      >
        <h2 style={{ fontSize: "22px", fontWeight: "600" }}>Cart</h2>

        {cart.length === 0 && <p>No items yet</p>}

        {cart.map((item, index) => (
          <p key={index}>
            {item.name} — €{item.price}
          </p>
        ))}

        <h3 style={{ marginTop: "10px" }}>Total: €{total.toFixed(2)}</h3>

        {/* CHECKOUT FORM */}
        {cart.length > 0 && (
          <form onSubmit={handleCheckout} style={{ marginTop: "20px" }}>
            <h3>Checkout</h3>

            <input
              type="text"
              placeholder="Your Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              style={{ width: "100%", padding: "8px", marginTop: "10px" }}
            />

            <input
              type="text"
              placeholder="Phone Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              style={{ width: "100%", padding: "8px", marginTop: "10px" }}
            />

            <input
              type="text"
              placeholder="Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
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
              Place Order
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
