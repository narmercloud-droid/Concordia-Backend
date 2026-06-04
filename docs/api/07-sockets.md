### WebSocket Events

This file documents socket.io event names, payloads, and when they are emitted.

---

## Order-related server-emitted events (from `src/socket/order.socket.ts`)

### order_created
- Payload: `order` object (full order as emitted)
- When: After a new order is created
- Who receives: Rooms: `branch_<branch_id>`
- Example:
```json
{ "id": "...", "branch_id": "<branch>", "status": "pending", "items": [...] }
```

### order_updated
- Payload: `order` object
- When: On general order updates (status changes, courier pickup, etc.)
- Who receives: Broadcast to all connected sockets

### order_assigned
- Payload: `order` object
- When: Order assigned to terminal (and branch)
- Who receives: `terminal_<terminal_id>` and `branch_<branch_id>`

### order_accepted / order_rejected
- Payload: `order` object
- When: Terminal accepts or rejects an assigned order
- Who receives: `terminal_<terminal_id>` (if present) and `branch_<branch_id>`

---

## KDS events (from `src/socket/kds.socket.ts`)

### kds:join
- Payload: `{ branchId: string }`
- When: Client subscribes to KDS updates for a branch
- Who receives: ack on socket; server joins `kds_branch_<branchId>` room

### kds:accept_order
- Payload: `{ orderId: string }`
- When: KDS operator accepts an order
- Emits: `kds:order_accepted` back to the requester
- Example response payload:
```json
{ "success": true, "event": "kds:order_accepted", "data": { "orderId": "...", "status": "accepted", "timestamp": 123456789 } }
```

### kds:start_preparing
- Payload: `{ orderId: string }`
- When: KDS marks order as preparing
- Emits: `kds:preparing_started` response payload similar to above

### kds:mark_ready
- Payload: `{ orderId: string }`
- When: KDS marks order ready for pickup
- Emits: `kds:order_ready`

### kds:get_active_orders
- Payload: `{ branchId: string }`
- When: Client requests current active orders for a branch
- Emits: `kds:active_orders` with `{ orders: [...], timestamp }`
- Note: server uses a short cache to avoid emitting unchanged data

---

Notes / Open questions:
- Other socket namespaces exist (admin/kds/order); scan `src/socket/*.ts` for additional events to include.

---

## Admin socket events (from `src/socket/admin.socket.ts`)

The admin namespace emits analytics/monitoring events scoped to a branch. The implementation includes a short in-memory/Redis-backed dedupe cache (TTL ~2s) to avoid redundant broadcasts.

### admin:ai_update
- Payload: `{ success: true, event: "admin:ai_update", data: any, timestamp: number }`
- When: periodic AI-driven metrics/forecasts for a branch (e.g., demand prediction)
- Who receives: `branch_<branchId>` room on admin namespace

### admin:churn_update
- Payload: `{ success: true, event: "admin:churn_update", data: any, timestamp: number }`
- When: churn statistics for branch (e.g., retention, churn rate)
- Who receives: `branch_<branchId>`

### admin:demand_update
- Payload: `{ success: true, event: "admin:demand_update", data: any, timestamp: number }`
- When: demand signal updates for branch (load forecasting)
- Who receives: `branch_<branchId>`

### admin:courier_performance_update
- Payload: `{ success: true, event: "admin:courier_performance_update", data: any, timestamp: number }`
- When: courier performance metrics (pickup times, acceptance rates)
- Who receives: `branch_<branchId>`

### Deduplication / caching behavior
- The socket implementation uses Redis via `batchGet`/`batchSet` and a short TTL (2s) keyed by event+branch to prevent re-emitting identical payloads.
- Observed helper functions: `shouldEmitEvent(event, branchId, data)` and `cacheEventData(event, branchId, data)`.

---

If you want, I can also extract and include example `data` payload shapes for each admin event by scanning the code paths that call `AdminSocket.emit*`.
