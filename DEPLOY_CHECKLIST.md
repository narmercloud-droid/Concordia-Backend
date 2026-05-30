# Deployment Checklist — Concordia Backend

Required environment variables
- DATABASE_URL — PostgreSQL connection URL
- REDIS_URL — Redis connection URL (use redis:// in production)
- JWT_SECRET — JWT secret key
- JWT_EXPIRES_IN — JWT expiry (e.g. 7d)
- PAYPAL_MODE — sandbox|live (default: sandbox)
- PAYPAL_CLIENT_ID
- PAYPAL_CLIENT_SECRET
- PAYPAL_WEBHOOK_ID
- ADMIN_EMAIL
- ADMIN_PASSWORD_HASH — bcrypt hash
- PUBLIC_URL — public base URL (e.g. https://example.com)
- CORS_ORIGIN — comma-separated allowed origins
- LOG_LEVEL — (info|debug|warn|error)
- PORT — server port (defaults to 4000)

Build & Startup
- Build command: `npm run build` (runs `tsc`) 
- Start command: `npm run start` (runs `node dist/index.js`)
- Postinstall: `prisma generate` (generate Prisma client after install)

Health & Metrics
- Health check path: `/health` (returns simple JSON via `success()`)
- Metrics path: `/metrics` (Prometheus format)

Node / Prisma
- Node version: use Node 18+ (project tested with Node 24 locally)
- Prisma: ensure `npx prisma generate` runs during build/postinstall

Redis behavior
- Locally, the app skips Redis when `REDIS_URL` is not a valid `redis://` URL
- In production, provide a proper `REDIS_URL` to enable Redis features

PayPal
- Default development mode is sandbox (`PAYPAL_MODE=sandbox`). Configure live credentials for production.

Notes
- Ensure `PORT` is provided by Railway or the app will default to 4000.
- Secure `/metrics` endpoint if exposing to public networks.
