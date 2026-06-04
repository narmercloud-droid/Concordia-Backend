### Environment Variables

Environment variables are validated by `src/config/env.ts` using Zod. Below are required and commonly used variables.

#### Required / important variables
- `NODE_ENV` — one of `development`, `production`, `staging`, `test`
- `PORT` — server port (default `4000`)
- `DATABASE_URL` — Postgres connection URL
- `JWT_SECRET` — secret for signing JWTs (min length enforced)
- `REDIS_URL` — Redis connection URL
- `PAYPAL_CLIENT_ID`, `PAYPAL_CLIENT_SECRET` — PayPal credentials

#### Optional / environment tuning
- `FRONTEND_URL` — frontend origin (CORS)
- `JWT_EXPIRES_IN` — token TTL (default `7d`)
- `LOG_LEVEL` — logging verbosity (default `info`)
- `CORS_ORIGIN` — explicit CORS origin
- `SENTRY_DSN` and `SENTRY_TRACES_SAMPLE_RATE` — optional Sentry config
- `API_KEYS` — comma-separated API keys for internal features

#### Example .env (development)
```
NODE_ENV=development
PORT=4000
DATABASE_URL=postgres://user:pass@localhost:5432/concordia_dev
JWT_SECRET=supersecret_local_jwt_key
JWT_EXPIRES_IN=7d
REDIS_URL=redis://localhost:6379
PAYPAL_CLIENT_ID=your_client_id
PAYPAL_CLIENT_SECRET=your_client_secret
LOG_LEVEL=debug
```

#### Production differences
- `NODE_ENV=production` — dotenv not loaded by default; environment must be provided by host.
- `SENTRY_DSN` typically set in production for error tracing.
- Ensure `JWT_SECRET` and `DATABASE_URL` are strong and not checked into source.

---

## Expanded variable list (observed in code)

These environment variables are referenced across the codebase (services, jobs, payments, push, uploads, workers). Fill the ones relevant to your deployment.

- `NODE_ENV` — `development|production|staging|test`
- `PORT` — HTTP port
- `DATABASE_URL` — Postgres connection string
- `SKIP_DB_INIT` — when `true` skip DB migrations/initialization during startup
- `REDIS_URL` — Redis connection string (e.g. `redis://...`)
- `JWT_SECRET` — main JWT signing secret
- `JWT_REFRESH_SECRET` — optional separate secret for refresh tokens
- `JWT_EXPIRES_IN` — access token TTL (e.g. `15m`, `7d`)
- `JWT_REFRESH_EXPIRES_IN` — refresh token TTL
- `FRONTEND_BASE_URL` / `FRONTEND_URL` / `PUBLIC_URL` — frontend origin(s) used in emails/QR links and CORS
- `LOG_LEVEL` — `debug|info|warn|error` (defaults applied in code)
- `SENTRY_DSN`, `SENTRY_TRACES_SAMPLE_RATE` — Sentry configuration

- Pay/Payment gateways:
	- `STRIPE_SECRET_KEY` — Stripe secret key
	- `STRIPE_PUBLISHABLE_KEY` — Stripe public key (optional)
	- `STRIPE_WEBHOOK_SECRET` — Stripe webhook signing secret
	- `PAYPAL_CLIENT_ID`, `PAYPAL_CLIENT_SECRET` — PayPal API credentials
	- `PAYPAL_MODE` — `live|sandbox` (switch PayPal base URL)
	- `PAYPAL_WEBHOOK_ID` — PayPal webhook id used for verification

- Push / Messaging / Campaigns:
	- `VAPID_PUBLIC_KEY`, `VAPID_PRIVATE_KEY` — Web Push VAPID keys
	- `VAPID_SUBJECT` — optional VAPID subject
	- `FCM_SERVER_KEY` — Firebase Cloud Messaging server key (push)
	- `RESEND_API_KEY` — Resend email API key (used by marketing/email campaigns)
	- `CAMPAIGN_FROM_EMAIL` — From address for campaign emails
	- `MESSAGEBIRD_API_KEY` — SMS provider key (messagebird)
	- `TWILIO_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_PHONE` — if Twilio integration is used (not required by default)

- Upload / Storage:
	- `S3_BUCKET` — S3 bucket name
	- `S3_ACCESS_KEY`, `S3_SECRET_KEY`, `S3_REGION` — S3 credentials/region

- Jobs / Workers / Runtime tuning:
	- `CLUSTER_WORKERS` — number of cluster worker processes
	- `LIFECYCLE_POLL_MS` — lifecycle job poll interval (ms)
	- `LIFECYCLE_ACCEPTED_TO_PREPARING_MIN` — lifecycle cutoff in minutes
	- `LIFECYCLE_PREPARING_TO_READY_MIN` — lifecycle cutoff in minutes
	- `LIFECYCLE_AUTOMATION_ENABLED` — enable lifecycle automation (`true|false`)
	- `PRINTER_BRANCH_ID` — used by printer jobs when running branch-scoped syncs

- CI / build / metadata
	- `GIT_COMMIT`, `COMMIT_SHA`, `REVISION` — commit id injected by CI for health routes / build info

- Feature toggles / protection
	- `BRUTE_FORCE_PROTECTION` — enable/disable brute-force protection
	- `API_KEYS` — comma-separated internal API keys

- Misc / service secrets
	- `DRIVER_QR_SECRET` — secret for driver QR tokens (fallback in code)
	- `RESEND_API_KEY` — campaign emails service key

---

## Example `.env` (development, expanded)
```
NODE_ENV=development
PORT=4000
DATABASE_URL=postgres://user:pass@localhost:5432/concordia_dev
JWT_SECRET=supersecret_local_jwt_key
JWT_REFRESH_SECRET=another_refresh_secret
JWT_EXPIRES_IN=7d
REDIS_URL=redis://localhost:6379
STRIPE_SECRET_KEY=sk_test_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
PAYPAL_CLIENT_ID=your_client_id
PAYPAL_CLIENT_SECRET=your_client_secret
PAYPAL_MODE=sandbox
VAPID_PUBLIC_KEY=BLah...
VAPID_PRIVATE_KEY=xyz...
RESEND_API_KEY=rsnd_xxx
S3_BUCKET=concordia-dev
S3_ACCESS_KEY=minioadmin
S3_SECRET_KEY=minioadmin
LOG_LEVEL=debug
```

## Notes
- `src/config/env.ts` is authoritative: it defines required keys and defaulting rules. If you are deploying, review that file and update the environment accordingly.
- Treat secrets (`JWT_SECRET`, `STRIPE_SECRET_KEY`, `PAYPAL_*`, `S3_SECRET_KEY`) as sensitive — use secret management in production (Key Vault, Secrets Manager, Railway envs, etc.).
- Some services have optional fallbacks (e.g., `SKIP_DB_INIT`) used in CI or local dev. Check the service that references a variable before omitting it.

---

Notes:
- `src/config/env.ts` will call `process.exit(1)` if required variables are missing or invalid. Review that file before deploying to ensure all required keys are present.
