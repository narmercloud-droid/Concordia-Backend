/**
 * Place a Kempen delivery test order (new customer, free drink, Pizzabrötchen + extras).
 * Usage: node scripts/place-kempen-test-order.mjs
 */

const API = process.env.API_URL ?? "https://api.concordiapizza.de";

const BRANCH_ID = "concordia-kempen";
const PIZZABROETCHEN_ID = 10076; // #52 Gefüllte Pizzabrötchen mit Sucuk (Straelen #55 equivalent)
const PIZZA_SALAMI_ID = 10067;

const stamp = Date.now().toString().slice(-7);
const customerPhone = `0170${stamp}`;
const customerName = "Test Neukunde";

const deliveryAddress = "Markt 5, 47906 Kempen";
const postalCode = "47906";
const deliveryLat = 51.3645;
const deliveryLng = 6.4196;

const items = [
  {
    itemId: PIZZABROETCHEN_ID,
    quantity: 3,
    variantId: undefined,
    addOnIds: [
      "extra-concordia-kempen-10076-fleisch-0", // Dönerfleisch
      "extra-concordia-kempen-10076-saucen-0", // Fetakäse
      "extra-concordia-kempen-10076-kraeuterbutter-0", // Kräuterbutter Portion
    ],
    notes: "Test: Pizzabrötchen mit Extras",
  },
  {
    itemId: PIZZA_SALAMI_ID,
    quantity: 1,
    variantId: "size-concordia-kempen-10067-gross",
    addOnIds: ["extra-concordia-kempen-10067-saucen-2"], // Gouda Käse
  },
];

const payload = {
  branchId: BRANCH_ID,
  fulfillmentType: "delivery",
  paymentMethod: "cash",
  paymentStatus: "pending",
  termsAccepted: true,
  isGuest: true,
  customerName,
  customerPhone,
  customerEmail: `test+${stamp}@concordia-test.local`,
  deliveryAddress,
  postalCode,
  deliveryLat,
  deliveryLng,
  freeDrinkChoice: 10126, // Coca-Cola 1,0l
  notes: "TESTBESTELLUNG — bitte nicht ausliefern",
  items,
};

async function main() {
  const quoteRes = await fetch(`${API}/api/branches/${BRANCH_ID}/delivery-quote`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ address: deliveryAddress, postalCode, orderTotal: 40, lat: deliveryLat, lng: deliveryLng }),
    signal: AbortSignal.timeout(30_000),
  });
  const quoteBody = await quoteRes.json();
  if (!quoteRes.ok) {
    console.error("Delivery quote failed:", quoteBody);
    process.exit(1);
  }
  console.log("Delivery quote:", quoteBody.data ?? quoteBody);

  const orderRes = await fetch(`${API}/api/v1/order`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(60_000),
  });
  const orderBody = await orderRes.json();
  if (!orderRes.ok) {
    console.error("Order failed:", orderBody);
    process.exit(1);
  }

  const order = orderBody.data ?? orderBody;
  console.log("\nOrder placed successfully:");
  console.log({
    id: order.id,
    status: order.status,
    customerName: order.customerName,
    customerPhone: order.customerPhone,
    subtotal: order.subtotal ?? order.orderTotal,
    total: order.total ?? order.orderTotal,
    deliveryFee: order.deliveryFee,
    discount: order.discount,
    freeDrinkChoice: order.freeDrinkChoice,
    notes: order.notes,
    items: order.items?.map((line) => ({
      name: line.item?.name ?? line.name,
      itemNumber: line.item?.itemNumber,
      quantity: line.quantity,
      price: line.price,
      extras: line.extras?.map((e) => e.name),
      variants: line.variants?.map((v) => v.name),
    })),
  });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
