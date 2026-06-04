### Auth API

This document covers authentication endpoints used by the backend (admin and customer).

---

### Admin Login
Method: POST
URL: /api/auth/login
Auth: Public
Controller/handler: route-level handler (`src/routes/auth.ts`) — uses `res.tson()` (ad-hoc response)
Description: Authenticate admin by email and password; returns JWT token and basic user payload. Brute-force protection applied.

#### Request
- Headers: `Content-Type: application/json`
- Body (ad-hoc validation in route):
  - `email` (string, required)
  - `password` (string, required)

Example request:

```json
{ "email": "admin@example.com", "password": "P@ssw0rd" }
```

#### Response (ad-hoc `res.tson` / `res.json`)
- 200 OK: `{ token: string, user: { id, role, branchId } }`
- 401 Unauthorized: `{ error: "Invalid credentials" }`
- 429 Too Many Requests: `{ error: "Too many login attempts from this IP" }` or `{ error: "Too many login attempts for this account" }`

Example response:

```json
{ "token": "<jwt>", "user": { "id": "...", "role": "manager", "branchId": "..." } }
```

Notes:
- Validation: route performs ad-hoc checks (`isBlockedByIp`, `isBlockedByUser`, existence of `email`, password compare); no Zod schema is applied here. Documented fields above reflect exact required fields.
- Envelope: ad-hoc (plain object). Consider standardizing to the Api-style envelope used by controller `wrap()` for consistency.

---

### Request Magic Link (Customer)
Method: POST
URL: /api/auth/request-link
Auth: Public
Handler: route-level (`src/routes/auth.ts`) — uses `res.tson()`
Request:
- Body: `{ email: string }` (ad-hoc validation: route checks `if (!email) return 400`)
Response:
- 200: `{ message: "Magic link sent. Check your email." }`
- 400: `{ error: "Email is required" }`

---

### Verify Token (Customer)
Method: GET
URL: /api/auth/verify?token=...
Auth: Public
Handler: route-level — `res.tson()`
Request:
- Query: `token` (string, required)
Response:
- 200: `{ token, customer: { id, email, name, phoneNumber } }`
- 400: `{ error: "Token is required" }`
- 401: `{ error: "Invalid or expired token" }`

---

### Admin Verify Token
Method: GET
URL: /api/auth/admin/verify?token=...
Auth: Public
Handler: route-level — `res.tson()`
Request:
- Query: `token` (string, required)
Response:
- 200: `{ token, admin: { id, email, role, branchId } }`
- 400/401: `{ error: "Invalid or expired admin token" }`

---

### Logout
Method: POST
URL: /api/auth/logout
Auth: Public (clears cookie)
Handler: route-level — clears cookie and returns `204 No Content` (no body)

---

Notes / Open questions:
- These auth endpoints are implemented at the route level and use direct `res.tson` / `res.json` responses with ad-hoc input checks. They do not use controller `wrap()` or Zod validation in the current codebase. I documented the expected request fields above based on the route logic.
