### Metrics API

### Prometheus Metrics Endpoint
Method: GET
URL: /api/metrics
Auth: Usually Public/Internal (no auth in route)
Description: Exposes Prometheus metrics for scraping. Returns text/plain Prometheus exposition format.

Response envelope: plain text (Prometheus exposition format). This endpoint does not use the JSON Api-style envelope.

#### Response
- 200: Prometheus metrics text
- 500: plain text `Error collecting metrics`

#### Notes
- Uses `registry.metrics()` from `src/metrics/metrics.ts`.
- `Content-Type` set to `registry.contentType` or `text/plain`.
