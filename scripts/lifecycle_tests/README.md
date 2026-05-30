# Lifecycle Tests

Run these scripts after building the backend so the compiled service is available in `dist`.

## Execute

From the repository root:

```bash
npm run build
node scripts/lifecycle_tests/run_lifecycle_tests.mjs
```

If using Docker Compose:

```bash
docker compose run --rm api node scripts/lifecycle_tests/run_lifecycle_tests.mjs
```
