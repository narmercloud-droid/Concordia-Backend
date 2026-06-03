# Railway Deployment Guide

This guide explains how to deploy the Concordia Backend to Railway (or similar PaaS).

## Environment Variables
Set the following environment variables in Railway's dashboard (Project -> Variables):

- `DATABASE_URL` (required): Postgres connection string.
- `REDIS_URL` (optional): Redis connection string (redis:// or rediss://) used for caching and rate-limiting.
- `API_KEYS` (required): Comma-separated keys for internal endpoints and `/metrics` access.
- `JWT_SECRET` (required): JWT signing secret.
- `JWT_EXPIRES_IN` (optional): e.g., `7d`
- `SENTRY_DSN` (optional): DSN for Sentry error tracking.
- `VAPID_PUBLIC_KEY` / `VAPID_PRIVATE_KEY` (optional): for Web Push.
- `GIT_COMMIT` or `REVISION` (optional): set current commit SHA to make `/version` return it.
- `NODE_ENV` = `production`

Notes:
- Ensure values are entered securely (Railway secrets). Avoid committing them.
- For `API_KEYS`, include at least one key for platform monitoring tools to query `/metrics` and `/metrics-lite`.

## Health Checks (Railway)
Configure Railway health checks:
- Liveness path: `GET /health` — expect HTTP 200 when healthy.
  - Response body: `{ status: 'ok', db: 'connected' }` when DB reachable.
- Readiness path: `GET /ready` — expect HTTP 200 only when DB, Redis (if used), and workers are ready; otherwise 503.

Add both endpoints in Railway service settings: set check interval and threshold per your SLA.

## Enabling Alerts
Railway supports integration with PagerDuty / Slack / Email via webhooks or third-party monitoring.
Recommended alerts:
- Liveness failures (service down)
- Readiness failures (service not accepting traffic)
- High error rate (HTTP 5xx spikes)
- High latency or resource usage

If you use Prometheus/Grafana: configure Prometheus to scrape `/metrics` and set alerting rules in Alertmanager.
If using Sentry: configure alerts for error rate and key exceptions.

## Backups
- Databases: Use Railway's managed Postgres backups or your DB provider's snapshot feature.
  - Schedule nightly backups and verify retention and restore procedures.
  - Test restores on staging quarterly.
- Redis: If using managed Redis, enable automatic snapshots/backups. For ephemeral Redis, ensure critical data is persisted elsewhere.

## Monitoring & Logs
- Metrics: scrape `/metrics` (Prometheus) — protected by `X-API-KEY` header. Also `/metrics-lite` for quick JSON checks.
- Logs: Enable Railway's log streaming and retention. Configure a centralized log sink (e.g., Papertrail, Datadog, or S3) for long-term storage.
- Error tracking: Configure `SENTRY_DSN` to send errors to Sentry.

## PgBouncer / Connection Pooling
If using PgBouncer, set connection hints on `DATABASE_URL` or configure pool sizes. The backend adds basic `connection_limit` hints if Postgres is detected.

## Post Deployment Checklist
1. Verify application process is running.
2. Call `/health` and `/ready` endpoints — both should return 200.
3. Verify `/version` contains the expected commit and `package.json` version.
4. Confirm Prometheus scrape of `/metrics` (if enabled).
5. Confirm logs stream to your logging provider and Sentry receives any errors.
6. Verify background jobs are running and processing tasks.

## Rollback & Maintenance
- Keep previous image available for quick rollback.
- During schema migrations, schedule a maintenance window and ensure backups are taken before migration.

## Troubleshooting
- DB failures: check `DATABASE_URL`, network rules, and DB scaling. Inspect slow queries and connection pool exhaustion.
- Redis failures: verify `REDIS_URL`, authentication, and network egress.
- Worker issues: check worker logs and restart timers.

---

This guide is a starting point; adapt the instructions to your organizational processes and Railway project settings.