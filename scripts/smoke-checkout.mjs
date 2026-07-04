/**
 * End-to-end checkout smoke test: menu → create order → status → reject.
 * Rejects the order via POST /api/v1/orders/:id/reject so it never hits the kitchen.
 *
 * Usage:
 *   npm run smoke:checkout
 *   SMOKE_API_URL=http://localhost:4000 npm run smoke:checkout
 *   SMOKE_BRANCH_ID=concordia-straelen npm run smoke:checkout
 */

const BASE = (process.env.SMOKE_API_URL || "https://api.concordiapizza.de").replace(/\/$/, "");
const BRANCH = process.env.SMOKE_BRANCH_ID || "concordia-kempen";
const LANG = process.env.SMOKE_LANG || "de";
const TIMEOUT_MS = Number(process.env.SMOKE_TIMEOUT_MS || 60_000);

async function api(path, options = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(`${BASE}${path}`, {
      ...options,
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {})
      }
    });
    const text = await res.text();
    let body;
    try {
      body = text ? JSON.parse(text) : null;
    } catch {
      body = text;
    }
    if (!res.ok) {
      const msg =
        (body && typeof body === "object" && (body.message || body.error?.message)) ||
        text ||
        res.statusText;
      throw new Error(`${options.method || "GET"} ${path} → ${res.status}: ${msg}`);
    }
    if (body && typeof body === "object" && "data" in body) return body.data;
    return body;
  } finally {
    clearTimeout(timer);
  }
}

function pickOrderLine(menu) {
  for (const category of menu.categories || []) {
    for (const item of category.items || []) {
      const group = (item.variantGroups || []).find((g) => (g.options || []).length > 0);
      if (group) {
        const variant = group.options[0];
        return { item, variant };
      }
      if (item.id) {
        return {
          item,
          variant: { id: item.id, name: item.name, price: Number(item.price ?? 0) }
        };
      }
    }
  }
  return null;
}

async function main() {
  console.log(`[smoke] API ${BASE} branch ${BRANCH}`);

  await api("/health");
  console.log("[ok] health");

  const menu = await api(`/api/branches/${BRANCH}/menu?lang=${LANG}`);
  const line = pickOrderLine(menu);
  if (!line) {
    throw new Error("No orderable menu item found");
  }
  const { item, variant } = line;
  console.log(`[ok] menu (${menu.categories?.length ?? 0} categories, item: ${item.name})`);

  const orderPayload = {
    branchId: BRANCH,
    isGuest: true,
    customerName: "[SMOKE] Automated checkout test",
    customerPhone: process.env.SMOKE_PHONE || "+499999990001",
    customerEmail: "smoke-test@concordiapizza.de",
    fulfillmentType: "pickup",
    paymentMethod: "cash",
    paymentStatus: "pending",
    termsAccepted: true,
    items: [
      {
        itemId: item.id,
        quantity: 1,
        price: Number(variant.price ?? item.price ?? 0),
        variantId: variant.id,
        addOnIds: [],
        variants: [
          {
            id: variant.id,
            name: variant.name,
            price: Number(variant.price ?? 0)
          }
        ],
        addOns: []
      }
    ]
  };

  const created = await api("/api/v1/order", {
    method: "POST",
    body: JSON.stringify(orderPayload)
  });
  const orderId = created.id || created.orderId;
  if (!orderId) {
    throw new Error("Create order response missing id");
  }
  console.log(
    `[ok] create order ${orderId} total=${created.orderTotal ?? "?"} payment=${created.paymentMethod ?? "?"}`
  );

  const status = await api(`/api/v1/order/${orderId}/status`);
  console.log(`[ok] status ${status.status ?? status.orderStatus ?? "unknown"}`);

  const rejected = await api(`/api/v1/orders/${orderId}/reject`, { method: "POST" });
  console.log(`[ok] rejected ${rejected.status ?? "rejected"}`);

  console.log("[smoke] checkout flow passed");
}

main().catch((err) => {
  console.error("[smoke] FAILED:", err.message || err);
  process.exit(1);
});
