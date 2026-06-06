# Go Live Checklist

This checklist covers steps to perform immediately before and after production deployment.

## Pre-Deployment
- **Branch & Build**: Ensure release branch is up-to-date and CI build is green.
- **Database Migrations**: Run Prisma migrations in a maintenance window:
  - `prisma migrate deploy`
  - Verify migrations applied on staging first.
- **Environment Variables**: Confirm the following env vars are set in the target environment:
  - `DATABASE_URL`, `REDIS_URL` (if using Redis), `JWT_SECRET`, `API_KEYS` (comma-separated), `NODE_ENV=production`, `PORT`
  - Optional: `SENTRY_DSN`, `VAPID_PUBLIC_KEY`, `VAPID_PRIVATE_KEY`, `GIT_COMMIT`/`REVISION`
- **Secrets & Keys**: Rotate or verify secrets for PayPal, SMTP, third-party APIs.
- **Backups**: Take a fresh DB backup (snapshot) and verify retention policy.
- **PgBouncer**: If using PgBouncer, ensure compatibility flags and connection limits are set.

## Deploy Steps
1. Deploy the release artifact (container or build) to the production host.
2. Set environment variables and secrets in the platform dashboard.
3. Start the application and verify it enters running state.
4. Confirm background workers start (check logs for worker start messages).

## Health & Readiness Checks
- Liveness endpoint: `GET /health` — expected 200 and body `{ status: 'ok', db: 'connected' }` when healthy.
- Readiness endpoint: `GET /ready` — expected 200 only when:
  - Prisma is connected
  - Redis (if enabled) is connected
  - Background workers initialized
  - Otherwise `/ready` returns 503 with service status details.
- Version endpoint: `GET /version` — verify service `version` and `commit` are present.

## Monitoring & Metrics
- Prometheus metrics: `/metrics` (protected by API key) — ensure Prometheus scrapes this path.
- Lightweight JSON metrics: `/metrics-lite` (protected by API key) for quick checks.
- Logs: Confirm platform log streaming is enabled; ensure Sentry is configured (if using).
- Alerts: Configure alerts for:
  - High error rate (HTTP 5xx increased)
  - DB connectivity issues
  - High latency
  - High memory usage / OOM

## Backups & Recovery
- Ensure automated DB backups are enabled and retention policy is configured.
- Test DB restore on a staging environment regularly.
- For Redis, enable snapshotting or managed-service backups if storing critical data.

## Post-Deployment Verification
- Run smoke tests against production endpoints (see `scripts/smokeTest.ts`).
- Verify critical workflows:
  - Login, order creation, payment webhooks, push/notifications, and background job processing.
- Confirm metrics increasing and no unexpected errors in logs.

## Rollback Plan
- Keep DB migration rollbacks ready (note: Prisma migrations are not automatically reversible).
- If critical regressions occur, redeploy the last known-good image and restore DB from snapshot if necessary.

## Operational Runbook
- Contact list for on-call engineers and DB admins.
- Common runbook steps for:
  - Restarting workers
  - Clearing cache (`/api` cache keys)
  - Reconnecting Redis
  - Investigating long-running DB queries

---

Keep this file updated with any environment-specific steps for your hosting platform.