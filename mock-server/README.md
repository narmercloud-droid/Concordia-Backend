# Concordia Mock Server

This mock server serves routes derived from `docs/openapi/openapi.yaml`.

Features
- Automatic route generation from the OpenAPI spec
- Static examples used when available
- Schema-based deterministic mock data using `json-schema-faker` and `@faker-js/faker`
- Basic request and response validation using `ajv`
- Logging of incoming requests
- Webhook simulation under `/simulate/webhooks/{eventName}`

Quick start

1. Install dependencies:

```bash
cd mock-server
npm install
```

2. Start mock server:

```bash
npm run mock
# server listens on port 4000 by default
```

Override responses
Response overrides
- Use the `/__overrides` API to set response overrides at runtime. The overrides file `mock-server/overrides.json` has the structure:

```json
{
	"/api/orders/{orderId}": {
		"GET": {
			"status": 200,
			"body": { "id": "ord_fixed_123", "status": "ready" }
		}
	}
}
```

- To add or merge overrides at runtime:

```bash
curl -X POST http://localhost:4000/__overrides -H "Content-Type: application/json" -d '{"/api/orders/{orderId}":{"GET":{"status":200,"body":{"id":"ord_fixed_123"}}}}'
```

- To clear overrides:

```bash
curl -X DELETE http://localhost:4000/__overrides
```

Simulate webhooks
- Use the simulate endpoint to trigger webhook handlers with optional custom payloads:

```bash
curl -X POST http://localhost:4000/simulate/webhooks/order.created -H 'Content-Type: application/json' -d '{"id":"evt_1"}'
```

Using with SDKs
- Point SDK baseUrl to `http://localhost:4000` and make calls. The server will return example responses where present and generated mock data otherwise.

Notes
- The generated mock data is deterministic within a run via seeded faker. Restarting the server resets the seed counter.
