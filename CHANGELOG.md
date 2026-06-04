# Changelog

All notable changes to this project are documented in this file.

## [v1.0.0] - 2026-06-05

### Added
- API versioning: canonical paths mounted under `/v1`.
- Production-hardening features in the mock server:
  - Rate limiting (per-IP and per-token) with `X-RateLimit-*` headers and `Retry-After` on 429.
  - Idempotency key support for safe retries (persisted to `mock-server/idempotency.json`).
  - Structured error envelope for predictable client handling.
  - Webhook signature verification (HMAC-SHA256) with `WEBHOOK_SECRET`.
  - `X-Retryable` hints and `X-Request-Id` correlation IDs.
  - Request logging as compact JSON lines for observability.
- SDK helpers: `verifyWebhookSignature` helpers added for TypeScript and Python SDKs.
- Documentation: `docs/production-hardening.md`, onboarding guide, and release plan added.

### Fixed
- Restored OpenAPI dereference stability after iterative spec edits (tests dereference cleanly).

### Tests
- All SDK integration tests pass: 136/136.
