### Orders API

Covers customer-facing and internal order endpoints.

---

### Create Order
Method: POST
URL: /api/orders/
Auth: Public (guest allowed)
Controller: `OrdersController.create` → `ordersService.createOrder`
Description: Create a new order; service expects `items` array and persists an `Order` (including `items`) via Prisma. Controller uses `wrap()` so responses follow the Api-style envelope: `{ success: true, data: <Order> }` or `{ success: false, error: { code, message, details? } }`.


#### Request
- Headers: `Content-Type: application/json`
- Body (observed/ad-hoc validation performed in service):
  - `items` (required): array of objects — each item: `{ itemId: string, variantId?: string, addOnIds?: string[], quantity?: number (default 1), notes?: string|null, price?: number }`
  - optional: `branchId`, `customerId`, `paymentMethod`, `isGuest`, `scheduledFor`, `tracking_token`, `paymentIntentId`, `paypalOrderId`, `courierId`, `externalAmount`, `paidAt`, `terminal_id`.

Example request:

```json
{
  "branchId": "branch_123",
  "customerId": "cust_456",
  "items": [ { "itemId": "itm_1", "variantId": "v_1", "quantity": 2, "price": 12.5 } ],
  "paymentMethod": "card"
}
```


#### Response
- 200 OK (Api-style): `{ "success": true, "data": <Order> }` — `data` contains the Prisma `Order` object including `items` relation. Example simplified response:

```json
{
  "id": "<uuid>",
  "branchId": "branch_123",
  "customerId": "cust_456",
  "status": "pending",
  "items": [ { "id": "<uuid>", "quantity": 2, "price": 12.5, "variantId": "v_1", "item": { "connect": { "id": "itm_1" } } } ],
  "createdAt": "2026-06-04T...Z"
}
```

Errors:
- `400` — `INVALID_INPUT` / missing fields (observed service message: "Order must include an items array").
- `500` — `INTERNAL_ERROR` or DB errors.

- Related socket events: `order_created` (emitted after persist), `order_assigned` / `order_updated` may follow during lifecycle.

#### Notes
- Implementation inserts to SQL `orders` and `order_items` tables directly.

---

### Branch Orders (Admin)
Method: GET
URL: /api/orders/branch/:branchId
Auth: `adminAuth` + `adminRole("manager")`
Controller: `OrdersController.listBranchOrders` → `ordersService.listBranchOrders`
Description: Returns recent orders for a branch (ordered desc by `createdAt`).

#### Response
- 200: array of `Order` objects (includes `items`).
- Errors: `401/403` for missing/insufficient admin role; `500` on DB errors.

### Update Order Status (Admin / Terminal)
Method: PUT
URL: /api/orders/:id/status
Auth: `adminAuth` + `adminRole("manager")`
Controller: `OrdersController.updateStatus` → `OrderLifecycleService.updateStatus`
Description: Update the order lifecycle status (e.g., `accepted`, `preparing`, `ready`, `picked_up`, `delivered`). This delegates to the lifecycle service which may emit socket events and update related fields.

#### Request
- Body: `{ status: string }` (see `orderStatusBodySchema` in `09-schemas.md`)

#### Response
- 200: updated `Order` object
- Errors: `400` invalid status, `404` order not found, `500` lifecycle errors

### Courier flow (public courier endpoints)
These endpoints are authenticated by `courierAuth` middleware and validate a courier token stored on the order.

1) Claim (accept assignment)
- Method: POST
- URL: /api/orders/courier/claim
- Auth: `courierAuth`
- Controller: `OrdersController.courierClaim`
- Request body: `{ orderId: string, courierToken: string }` (see `09-schemas.md`)
- Response: updated `Order` object if successful
- Errors: `403` (fail:'FORBIDDEN' — invalid/expired token), `401` for missing auth

2) Courier picked up
- Method: POST
- URL: /api/orders/courier/picked-up
- Auth: `courierAuth`
- Controller: `OrdersController.courierPickedUp`
- Request body: `{ orderId: string, courierToken: string }`
- Response: updated `Order` with courier status updated to `picked_up`
- Side effects: may update courier-specific fields; emits `order_updated` socket event.

3) Courier delivered
- Method: POST
- URL: /api/orders/courier/delivered
- Auth: `courierAuth`
- Controller: `OrdersController.courierDelivered`
- Request body: `{ orderId: string, courierToken: string }`
- Response: updated `Order` with status `delivered`.
- Side effects: awards loyalty points to customer (see `ordersService.courierDelivered` — increments `customer.loyaltyPoints` based on order total), emits `order_updated`.

---

Notes / Open questions:
- Response objects are Prisma `Order` models; for client generation, use `prisma/schema.prisma` fields (see `09-schemas.md`).
- Lifecycle status transitions are handled by `OrderLifecycleService` and may emit socket events (`order_updated`, `order_assigned`, etc.).

---

Notes / Open questions:
- There are additional order-related routes under `src/routes/order` and `src/routes/order/*` (lifecycle) — those should be expanded in a follow-up pass to document status transitions, webhooks, and internal admin actions.
