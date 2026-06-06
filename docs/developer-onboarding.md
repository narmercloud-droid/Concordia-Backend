# Developer Onboarding (Backend)

Quick steps to get a new developer up and running locally.

1. Prerequisites
   - Node.js 18+ and npm
   - Python 3.8+ (for Python SDK work)
   - PostgreSQL and Redis locally (or use Docker Compose)

2. Clone and install

```bash
git clone <repo-url>
cd Concordia-Backend
npm ci
```

3. Environment
   - Copy `.env.example` to `.env` and populate required variables.
   - For local mock testing, set `WEBHOOK_SECRET=dev-webhook-secret`.

4. Start mock server

```bash
node mock-server/index.js
# or in background
```

5. Run tests

```bash
npm run sdk:test
```

6. Common tasks
   - Clear idempotency store: `rm -f mock-server/idempotency.json && echo '{}' > mock-server/idempotency.json`
   - Inspect request logs — the mock server prints compact JSON per request.

7. Contacts
   - Backend maintainers: see `MAINTAINERS` file or repo metadata.
