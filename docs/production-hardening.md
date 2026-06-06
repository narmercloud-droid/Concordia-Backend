# Production Hardening (mock server)

This document describes the production-hardening features implemented in the mock server used for testing. The mock server implements several safety, reliability and observability features so tests better match production behavior.

## Rate limiting

- Behavior: Per-request rate limiting is applied in middleware. Limits are evaluated per-IP and per-token (when an Authorization Bearer token is present). Limits vary by endpoint type (auth/admin/order creation have stricter defaults).
- Headers set on responses:
  - `X-RateLimit-Limit`: numeric ceiling for the current window
  - `X-RateLimit-Remaining`: remaining requests in window
  - `X-RateLimit-Reset`: Unix epoch seconds when window resets
  - `Retry-After`: set on 429 responses (seconds)
- Example 429 response:

```json
{
  "code": "TOO_MANY_REQUESTS",
  "message": "Rate limit exceeded (per-IP)",
  "details": { "limit": 30 }
}
```

Default limits in the mock server (can be adjusted in code):
- Per-IP: 120 req/min (lower for auth/admin/endpoints)
- Per-token: 600 req/min (lower for auth/admin endpoints)

## Idempotency keys

- Behavior: If a request includes an `Idempotency-Key` header (case-insensitive), the server will short-circuit and return the previously stored response for that key if present. For newly-seen idempotency keys, the server will persist the produced response (status, headers and body) to `mock-server/idempotency.json` so subsequent retries will return identical results.
- Header recognized: `Idempotency-Key` (also accepted in lowercase).
- Stored object shape (example):

```json
{
  "<idem-key-value>": {
    "status": 201,
    "body": { "id": "ord_xxx", "status": "created", ... },
    "headers": { "Content-Type": "application/json", "X-Request-Id": "req_xxx" }
  }
}
```

Example: a `POST /v1/api/orders` with `Idempotency-Key: abc123` will cause the mock server to save the response at `mock-server/idempotency.json` and return the same response for future requests that include the same key.

## Structured error format

- Behavior: The mock server returns structured errors using a small envelope to make it easy for clients to classify failures.
- Error JSON shape:

```json
{
  "code": "STRING_ERROR_CODE",
  "message": "Human readable message",
  "details": null
}
```

- Typical codes include: `BAD_REQUEST`, `NOT_FOUND`, `UNAUTHORIZED`, `FORBIDDEN`, `TOO_MANY_REQUESTS`, `INTERNAL_ERROR`, `WEBHOOK_SIGNATURE_INVALID`, etc.

## Webhook signature verification

- Behavior: Webhook handler routes detect signatures when the request contains one of the supported signature headers and will verify HMAC-SHA256 against the `WEBHOOK_SECRET` environment variable (fallback `dev-webhook-secret` in the mock for local use).
- Recognized headers (case-insensitive): `x-concordia-signature`, `x-signature`, `x-signature-hmac`.
- The server computes a hex HMAC-SHA256 of the raw request body and compares it using a timing-safe comparison. If the signature does not match, the server returns 401 with `code: WEBHOOK_SIGNATURE_INVALID`.
- Example invalid signature response:

```json
{
  "code": "WEBHOOK_SIGNATURE_INVALID",
  "message": "Invalid webhook signature",
  "details": null
}
```

Notes: The mock server captures the raw request body (`req.rawBody`) for accurate signature verification.

## Retry semantics

- Behavior: Responses that are safe to retry are marked with header `X-Retryable: true`. The server marks `X-Retryable: true` for safe methods (`GET`, `HEAD`, `OPTIONS`) and for requests that include an `Idempotency-Key`.

### Example `X-Retryable` header

```
HTTP/1.1 200 OK
X-Retryable: true
X-RateLimit-Limit: 120
X-RateLimit-Remaining: 119

{ "message": "ok" }
```
## Logging & correlation IDs

- Behavior: Each request is assigned a correlation id and the header `X-Request-Id` is propagated on responses. If the client supplies `X-Request-Id`, that value is used.
- The mock server logs a compact JSON object per request with fields: `at` (ISO timestamp), `id` (request id), `method`, `path`, `status`, `duration_ms`.

## Runtime considerations

- Persistence: The idempotency store and `overrides.json` are persisted to the mock-server directory. Tests should reset or clear `mock-server/idempotency.json` between runs to avoid cross-test pollution.
- Secrets: The mock server uses `process.env.WEBHOOK_SECRET` for webhook verification. In CI, set `WEBHOOK_SECRET` to the same value used by the test harness when simulating webhooks.

### Clearing idempotency store (tests)

To avoid cross-test pollution, remove or reset the idempotency file before or after running suites. Examples:

PowerShell:

```powershell
Remove-Item -Force mock-server\idempotency.json
New-Item -Path mock-server\idempotency.json -Value "{}" -Force
```

Unix / Git Bash:

```bash
rm -f mock-server/idempotency.json && echo '{}' > mock-server/idempotency.json
```

Or programmatically within tests:

```js
fs.writeFileSync(path.join(__dirname, '..', 'mock-server', 'idempotency.json'), JSON.stringify({}));
```

## Examples (end-to-end)

### Rate limiting - success headers

Response headers for a successful request:

```
HTTP/1.1 200 OK
X-RateLimit-Limit: 120
X-RateLimit-Remaining: 118
X-RateLimit-Reset: 169xxxxxxx
```

### Rate limiting - example 429 body

Request:

```bash
curl -i -X GET http://localhost:4000/v1/api/branches
```

Response (429):

```http
HTTP/1.1 429 Too Many Requests
Retry-After: 60
Content-Type: application/json

{
  "code": "TOO_MANY_REQUESTS",
  "message": "Rate limit exceeded (per-IP)",
  "details": { "limit": 30 }
}
```

### Idempotency - stored response and retrieval

First request (creates order):

```bash
curl -i -X POST http://localhost:4000/v1/api/orders \
  -H "Content-Type: application/json" \
  -H "Idempotency-Key: abc123" \
  -d '{"items":[{"name":"Coffee","price":3.5,"quantity":1}]}'
```

Response (first call):

```
HTTP/1.1 201 Created
Content-Type: application/json
X-Request-Id: req_abcd

{ "id": "ord_a1b2c3", "status": "created", "totals": { "subtotal": 3.5, "total": 3.5 } }
```

Second request with same `Idempotency-Key`:

```
HTTP/1.1 201 Created
Content-Type: application/json
X-Request-Id: req_abcd

{ "id": "ord_a1b2c3", "status": "created", "totals": { "subtotal": 3.5, "total": 3.5 } }
```

The response body/status/headers are identical because the mock server persisted them under `mock-server/idempotency.json`.

### Structured errors - examples

Bad request (validation)

```
HTTP/1.1 400 Bad Request
Content-Type: application/json

{
  "code": "BAD_REQUEST",
  "message": "Invalid request body",
  "details": { "errors": [ { "path": "/items/0/price", "message": "must be number" } ] }
}
```

Unauthorized

```
HTTP/1.1 401 Unauthorized
Content-Type: application/json

{
  "code": "UNAUTHORIZED",
  "message": "Missing or invalid credentials",
  "details": null
}
```

### Webhook signature - example

Compute signature (HMAC-SHA256 hex of raw body) and send header `x-concordia-signature: <hex>` (mock accepts plain hex or `sha256=<hex>` prefix). Example curl:

```bash
PAYLOAD='{"orderId":"ord_123","status":"created"}'
SIG=$(printf "%s" "$PAYLOAD" | openssl dgst -sha256 -hmac "dev-webhook-secret" -binary | xxd -p -c 256)
curl -i -X POST http://localhost:4000/v1/webhooks/order_created \
  -H "Content-Type: application/json" \
  -H "x-concordia-signature: $SIG" \
  -d "$PAYLOAD"
```

If the signature is invalid, response:

```
HTTP/1.1 401 Unauthorized
Content-Type: application/json

{
  "code": "WEBHOOK_SIGNATURE_INVALID",
  "message": "Invalid webhook signature",
  "details": null
}
```

### Logging example

Per-request log line (one JSON object per request):

```json
{"at":"2026-06-05T12:34:56.789Z","id":"req_k3j4","method":"POST","path":"/v1/api/orders","status":201,"duration_ms":23}
```

## Where this is implemented

All behaviour above is implemented in the mock server runtime at `mock-server/index.js`.

## Example headers summary

- Rate limit headers: `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`, `Retry-After` (on 429)
- Correlation: `X-Request-Id`
- Idempotency: `Idempotency-Key`
- Retry hint: `X-Retryable`
- Webhook signature headers: `x-concordia-signature`, `x-signature`, `x-signature-hmac`

---
Document created for test/CI clarity — do not duplicate these behavioral changes into the canonical OpenAPI unless you intend to change the public contract.

## Operational Notes

### Recommended environment variables

- `WEBHOOK_SECRET` — HMAC secret used to verify webhook payloads (mock server reads this currently). Example: `export WEBHOOK_SECRET=prod-webhook-secret`.
- `MOCK_RATE_LIMIT_PER_IP` — recommended override for per-IP rate limit (integer). Default behavior in code: 120 req/min.
- `MOCK_RATE_LIMIT_PER_TOKEN` — recommended override for per-token rate limit (integer). Default behavior in code: 600 req/min.
- `MOCK_DISABLE_RATE_LIMIT` — when set to `1` or `true`, CI can skip rate limiting by starting the mock with this env var and a small wrapper that bypasses the middleware (or set very high limits).
- `MOCK_DISABLE_IDEMPOTENCY` — when set to `1` or `true`, CI can choose to ignore idempotency persistence (or clear the store before tests).
- `MOCK_IDEMPOTENCY_PATH` — path to the idempotency JSON store (default: `mock-server/idempotency.json`).
- `LOG_LEVEL` — control verbosity for mock server logging; set to `error|warn|info|debug`.

Notes: only `WEBHOOK_SECRET` is read by the current mock-server implementation. The other variables are recommended operational knobs; to use them without modifying the code, set them in CI and add a tiny wrapper script to the server startup that adjusts behavior (for example, clear the idempotency file or set very high rate limits).

### Rotating webhook secrets

For the mock server (and for production systems), follow these steps to rotate the HMAC webhook secret with minimal disruption:

1. Deploy a new secret to a short-lived environment variable name (e.g. `WEBHOOK_SECRET_NEW`) and restart a canary instance that validates both old and new secrets (requires code to accept a list of valid secrets).
2. Update sending systems to sign with the new secret and verify on the canary.
3. Once verified, set `WEBHOOK_SECRET` to the new value and roll the mock server instances.
4. Remove the old secret after a safe expiry window.

If you cannot accept two secrets simultaneously in the mock server, perform a brief restart with the new `WEBHOOK_SECRET` and re-run webhook simulations to validate.

### Clearing or disabling idempotency storage in CI

Preferable: clear the idempotency store before each CI test run to ensure deterministic behavior. Examples:

PowerShell:

```powershell
# clear
Remove-Item -Force mock-server\idempotency.json -ErrorAction SilentlyContinue
# create empty store
'{}' | Out-File -Encoding utf8 mock-server\idempotency.json
```

Unix / Bash:

```bash
rm -f mock-server/idempotency.json && echo '{}' > mock-server/idempotency.json
```

Alternative: set `MOCK_DISABLE_IDEMPOTENCY=1` in CI and start the mock server using a small wrapper script that ignores idempotency (requires a tiny local patch or startup wrapper).

### Disabling or relaxing rate limiting in CI

Two practical approaches:

1. Disable by clearing or bypassing the middleware via a startup wrapper that sets `MOCK_DISABLE_RATE_LIMIT=1` and the wrapper starts Node with a small runtime flag the code checks (requires a tiny addition to the server), or
2. Relax the limits by setting very large values before starting the server in CI:

```bash
export MOCK_RATE_LIMIT_PER_IP=1000000
export MOCK_RATE_LIMIT_PER_TOKEN=1000000
npm run start:mock
```

If you cannot change the code, prefer approach (2) by setting very high limits so tests are not affected by throttling.

### Notes on retry headers for load testing

- `X-Retryable: true` indicates that clients may safely retry the request. When performing load testing, clients or load generators should respect `Retry-After` and avoid aggressive automatic retries that could amplify load.
- To measure raw throughput, disable idempotency and retries in the client or instruct the load tester to ignore `X-Retryable` and perform repeat requests without retries.

### Quick CI checklist

- Ensure `mock-server/idempotency.json` is cleared before the test run.
- Set `WEBHOOK_SECRET` to match the test harness if webhooks are exercised.
- Optionally set `MOCK_RATE_LIMIT_PER_IP` and `MOCK_RATE_LIMIT_PER_TOKEN` to high values or set `MOCK_DISABLE_RATE_LIMIT` in CI wrapper.
- Capture logs with `LOG_LEVEL=info` and preserve request ids for post-mortem.
