# Changelog

All notable changes to this project will be documented in this file.

## [v1.2.0] - 2026-06-04
### Added
- Webhooks: `order.created`, `order.updated`, `order.status_changed`, `payment.succeeded`, `payment.failed`, `courier.assigned`, `courier.location_updated`, `branch.opening_hours_changed` (documented in OpenAPI).

## [v1.1.0] - 2026-06-04
### Added
- Admin API: `/api/admin/*` endpoints for auth, orders, menu, branches, metrics.

## [v1.0.0] - 2026-06-04
### Added
- Public API: Orders, Menu, Cart, Payments, Notifications (customer-facing) schemas and endpoints. Initial public release.

### Deprecation Policy
- Breaking changes will be announced with at least 90 days notice.
- Deprecated endpoints will be marked in the OpenAPI spec with `deprecated: true`.
- SDK maintainers will publish updates before removing deprecated endpoints.
