/**
 * Place a test delivery order for Straelen (cash/COD).
 * Run: node scripts/test-straelen-delivery-order.mjs
 */
const API =
  process.env.API_URL?.replace(/\/$/, "") ??
  "https://concordia-backend-web.onrender.com";

const payload = {
  branchId: "concordia-straelen",
  isGuest: true,
  customerName: "Test Lieferung",
  customerPhone: "01701234567",
  customerEmail: "test@example.com",
  fulfillmentType: "delivery",
  deliveryAddress: "Markt 5, 47638 Straelen",
  paymentMethod: "cash",
  notes: "TEST ORDER — bitte stornieren",
  items: [
    {
      id: 20131,
      quantity: 2,
      unitPrice: 5,
      name: "Pizza Margherita",
      variants: [],
      addOns: []
    }
  ]
};

const res = await fetch(`${API}/api/v1/order`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(payload)
});

const text = await res.text();
console.log("HTTP", res.status);
try {
  const json = JSON.parse(text);
  console.log(JSON.stringify(json, null, 2));
} catch {
  console.log(text.slice(0, 800));
}
