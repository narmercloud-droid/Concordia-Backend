# Concordia Backend Architecture

Components

- Express API
  - Handles HTTP requests, routing, middleware for auth, validation, logging, and rate limiting.

- Prisma + PostgreSQL
  - Prisma is the ORM connected to PostgreSQL. Production DB URL is provided via `DATABASE_URL`.
  - Code includes small connection hinting (`connection_limit` and `pool_timeout`) to be PgBouncer-friendly.

- Redis
  - Provides caching for JSON responses, rate limiting counters, and brute-force tracking.
  - Configure `REDIS_URL` in production.

- Background jobs
  - Implemented with `setInterval` workers and managed timers. Workers are stopped cleanly during shutdown.

- WebSockets
  - Socket.IO (or native WebSocket implementation) used for realtime events and notifications.

Deployment flow (Railway)
- Provide env vars in Railway project settings (see `env.example`).
- Build and start using the project's `package.json` scripts or Dockerfile tailored for production.

Security considerations
- Secrets are validated at startup (no insecure fallbacks).
- CORS is restricted to `FRONTEND_URL`.
- Helmet and strict headers applied.
- Input sanitization prevents prototype pollution and basic XSS.
