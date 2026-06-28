/**
 * Create a guest cash pickup test order on production.
 * Usage: node scripts/create-test-order.mjs [branchId]
 */
const branchId = process.argv[2] || "concordia-straelen";
const API =
  process.env.ORDER_API_URL ||
  "https://concordia-backend-web.onrender.com/api/v1/order";

const branchItems = {
  "concordia-straelen": {
    itemId: 20000,
    price: 5,
    name: "Pizza Margherita (klein)",
    variantId: "size-concordia-straelen-20000-klein"
  },
  "concordia-kempen": {
    itemId: 10000,
    price: 5,
    name: "Pizza Margherita",
    variantId: "size-concordia-kempen-10000-klein"
  }
};

const item = branchItems[branchId];
if (!item) {
  console.error("Unknown branch:", branchId);
  process.exit(1);
}

const payload = {
  branchId,
  isGuest: true,
  customerName: "Terminal Test",
  customerPhone: "01709999999",
  fulfillmentType: "pickup",
  paymentMethod: "cash",
  notes: "TEST ORDER – please ignore / stornieren",
  items: [
    {
      itemId: item.itemId,
      quantity: 1,
      price: item.price,
      ...(item.variantId ? { variantId: item.variantId } : {})
    }
  ]
};

console.log("POST", API);
console.log("Branch:", branchId, "–", item.name);

const res = await fetch(API, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(payload)
});

const text = await res.text();
let body;
try {
  body = JSON.parse(text);
} catch {
  body = text;
}

console.log("HTTP", res.status);
console.log(typeof body === "string" ? body : JSON.stringify(body, null, 2));

if (!res.ok) process.exit(1);
