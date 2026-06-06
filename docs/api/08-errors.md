### Error Formats & Mapping

The project uses a small `contracts/api` wrapper to standardize controller responses. There are two common response styles in the codebase:

- Api-style (controller `wrap()` / `ok()` / `fail()`):
  - Successful responses: `{ "success": true, "data": <T> }`
  - Error responses: `{ "success": false, "error": { "code": "<CODE>", "message": "...", "details"?: any } }`
  - Controllers typically `return` values (not call `res.*`) and `wrap()` converts them into the envelope above.

- Ad-hoc responses (routes use `res.tson()` / `res.json()` directly):
  - These endpoints return arbitrary JSON objects (legacy/route-layer handlers). Many still return `{ success: true, ... }` but shapes vary per-route (examples provided per endpoint in docs).

Note: `res.tson()` is an alias for `res.json()` set up in `src/index.ts`.

---

Error code → HTTP status mapping

The `wrap()` implementation maps `ApiError.code` string values to HTTP status codes. Mapping (from `dist/contracts/api.js`):

| Error code | HTTP status |
|---|---:|
| `NOT_FOUND` | 404 |
| `UNAUTHORIZED` | 401 |
| `FORBIDDEN` | 403 |
| `CONFLICT` | 409 |
| `INVALID_INPUT`, `VALIDATION_ERROR` | 400 |
| `INTERNAL_ERROR` (and any other/unrecognized code) | 500 |

When a controller throws a `fail(code, message, details)` object, the wrapper sends `{ success: false, error: { code, message, details } }` with the status code above.

---

Example Api-style error response:

```json
{ "success": false, "error": { "code": "NOT_FOUND", "message": "Item not found", "details": null } }
```

Example ad-hoc error response (route-layer):

```json
{ "error": "Email is required" }
```

---

Docs guidance:
- For endpoints implemented via controller `wrap()`, the canonical documented response envelope is the Api-style envelope above.
- For endpoints that call `res.tson()`/`res.json()` directly, the docs show the exact existing shape and note the route is ad-hoc; consider standardizing to the Api-style envelope.
