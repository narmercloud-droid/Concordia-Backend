const BASE = process.env.API_URL ?? "http://localhost:4000";

const menuRes = await fetch(`${BASE}/api/branches/concordia-kempen/menu`);
const menu = await menuRes.json();
const categories = menu.data?.categories ?? menu.data ?? menu;
const firstItem = categories?.[0]?.items?.[0];

if (!firstItem) {
  console.error("No menu items found");
  process.exit(1);
}

console.log("Testing with item:", firstItem.name, firstItem.id);

const orderRes = await fetch(`${BASE}/orders`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    branchId: "concordia-kempen",
    customerName: "Test Customer",
    customerPhone: "01711234567",
    fulfillmentType: "delivery",
    deliveryAddress: "Concordienplatz 1, 47906 Kempen",
    paymentMethod: "cash",
    isGuest: true,
    items: [{ itemId: firstItem.id, quantity: 3, price: firstItem.price }]
  })
});

const orderBody = await orderRes.json();
console.log("status", orderRes.status);
console.log(JSON.stringify(orderBody, null, 2).slice(0, 1500));

if (orderBody.data?.courierUrl) {
  console.log("Courier URL:", orderBody.data.courierUrl);
}

const terminalRes = await fetch(`${BASE}/api/terminal/orders?branchId=concordia-kempen`);
const terminalBody = await terminalRes.json();
console.log("Terminal orders:", terminalBody.data?.length ?? 0);
