# Concordia Backend

Project: Concordia Backend (Express + Prisma)

Overview
- Express.js API server with Prisma ORM (Postgres), Redis caching, background jobs, and WebSockets.

Folder structure (important parts)
- `src/` — application source code
  - `routes/` — Express routes
  - `services/` — business services
  - `jobs/` — background jobs and schedulers
  - `prisma/` — Prisma schema and client
  - `redis/` — Redis client/wrappers
  - `middleware/` — Express middleware (auth, validation, rate-limiting, cache)
- `prisma/` — Prisma schema and migrations

Environment variables
See `env.example` for required variables. Secrets must be provided in production — there are no insecure fallbacks.

Run locally
- Install dependencies: `npm ci`
- Copy `.env` from `env.example` and populate secrets
- Start dev server: `npm run dev` (project-specific script)

Deploy to Railway
- Provide required env vars in Railway project settings (see `env.example`).
- Use the provided `railway.json`/`railway.config.json` for default settings.

Health check
- `GET /health` — returns service status and DB connectivity. Use this endpoint for readiness/liveness checks.

Logging
- Structured JSON logging with `pino`. Request IDs are generated and propagated. Logs include `requestId`.

Redis caching & rate-limiting
- Redis is used for caching JSON responses and for rate limiting / brute-force protection. Configure `REDIS_URL` in env.

Notes
- This repository contains both backend and frontend projects. This README focuses on the backend service.
# Concordia Backend - Deployment & Observability

## Overview

This document outlines the deployment and observability setup for the Concordia Backend, including containerization, environment management, monitoring, and CI/CD pipelines.

## 🐳 Containerization

### Docker Setup

The application is containerized using Docker with the following components:

- **Base Image**: `node:20-alpine`
- **Build Process**: TypeScript compilation and dependency installation
- **Health Checks**: Built-in Docker health checks using `/health/live` endpoint

### Docker Compose (Local Development)

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

Services included:
- **API**: Concordia backend (port 3000)
- **PostgreSQL**: Database (port 5432)
- **Redis**: Cache & session store (port 6379)

## 🌍 Environment Management

### Environment Files

The application supports multiple environments with dedicated configuration files:

- `.env.development` - Local development
- `.env.staging` - Staging environment
- `.env.production` - Production environment

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NODE_ENV` | Environment (development/staging/production) | Yes |
| `DATABASE_URL` | PostgreSQL connection string | Yes |
| `REDIS_URL` | Redis connection string | Yes |
| `JWT_ACCESS_SECRET` | JWT access token secret | Yes |
| `JWT_REFRESH_SECRET` | JWT refresh token secret | Yes |
| `CORS_ORIGIN` | Allowed CORS origins (comma-separated) | Yes |
| `SOCKET_ORIGIN` | Allowed Socket.IO origins (comma-separated) | Yes |
| `LOG_LEVEL` | Logging level (error/warn/info/debug) | Yes |

## 🏥 Health Checks

### Endpoints

- `GET /health/live` - Liveness probe (basic service availability)
- `GET /health/ready` - Readiness probe (full dependency check)
- `GET /health` - Comprehensive health check (legacy)

### Dependencies Checked

- PostgreSQL database connection
- Redis connection
- Socket.IO server status

## 📊 Monitoring & Observability

### Prometheus Metrics

Metrics are exposed at `GET /metrics` and include:

- **HTTP Metrics**: Request duration, status codes, endpoints
- **Socket Metrics**: Active connections count
- **Business Metrics**: Order counts, AI predictions
- **System Metrics**: Default Node.js metrics

### Logging

- **Format**: JSON-structured for Loki ingestion
- **Fields**: timestamp, requestId, branchId, environment, service
- **Middleware**: Request logging with performance tracking
- **Levels**: Configurable via `LOG_LEVEL` environment variable

### Error Tracking

- **Sentry Integration**: Automatic error capture and reporting
- **Environment-Specific**: Only active in staging/production
- **Performance Monitoring**: Request tracing and profiling

## 🚀 Kubernetes Deployment

### Manifests

Located in `/k8s/` directory:

- `deployment.yaml` - Application deployment with HPA
- `service.yaml` - ClusterIP service
- `ingress.yaml` - NGINX ingress with WebSocket support
- `hpa.yaml` - Horizontal Pod Autoscaler (CPU: 60%, Memory: 70%)
- `configmap.yaml` - Non-sensitive configuration
- `secret.yaml` - Sensitive configuration (secrets)

### Deployment Commands

```bash
# Apply all manifests
kubectl apply -f k8s/

# Check rollout status
kubectl rollout status deployment/concordia-backend

# View logs
kubectl logs -f deployment/concordia-backend

# Scale manually (if needed)
kubectl scale deployment concordia-backend --replicas=5
```

### Ingress Configuration

- **Host**: `api.concordia.com`
- **TLS**: Let's Encrypt certificates via cert-manager
- **WebSocket**: Enabled for Socket.IO connections

## 🔄 CI/CD Pipeline

### GitHub Actions Workflow

Located at `.github/workflows/deploy.yml`:

1. **Test Stage**:
   - Code checkout
   - Dependency installation
   - Linting (`npm run lint`)
   - Unit tests (`npm test`)
   - TypeScript compilation

2. **Build Stage**:
   - Docker image build
   - Push to GitHub Container Registry

3. **Deploy Stage**:
   - Staging deployment (automatic on main branch)
   - Production deployment (manual approval required)
   - Health checks validation

### Required Secrets

Set these in GitHub repository secrets:

- `KUBE_CONFIG_STAGING` - Kubernetes config for staging
- `KUBE_CONFIG_PRODUCTION` - Kubernetes config for production

## 📈 Observability Stack

### Recommended Setup

1. **Prometheus**: Scrape `/metrics` endpoint
2. **Grafana**: Create dashboards for:
   - API latency and throughput
   - Order lifecycle timings
   - Socket connection metrics
   - Branch demand forecasting
   - Courier performance analytics

3. **Loki**: Collect JSON logs from containers
4. **Tempo**: Distributed tracing (optional)
5. **Sentry**: Error tracking and alerting

### Sample Grafana Queries

```promql
# API Response Time
histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m]))

# Active Socket Connections
active_sockets_total

# Order Rate by Branch
rate(branch_orders_total[5m])
```

## 🔧 Local Development

### Prerequisites

- Docker & Docker Compose
- Node.js 20+
- PostgreSQL (optional, can use Docker)

### Quick Start

```bash
# Clone repository
git clone <repository-url>
cd concordia-backend

# Install dependencies
npm install

# Start infrastructure
docker-compose up -d postgres redis

# Run in development mode
npm run dev

# Run tests
npm test

# Build for production
npm run build
```

### Health Check Verification

```bash
# Liveness check
curl http://localhost:3000/health/live

# Readiness check
curl http://localhost:3000/health/ready

# Metrics
curl http://localhost:3000/metrics
```

## 🚨 Troubleshooting

### Common Issues

1. **Health Check Failures**:
   - Check database connectivity
   - Verify Redis connection
   - Ensure Socket.IO is initialized

2. **Container Startup Issues**:
   - Verify environment variables
   - Check Docker logs: `docker-compose logs api`

3. **Kubernetes Deployment Issues**:
   - Check pod status: `kubectl get pods`
   - View logs: `kubectl logs -f deployment/concordia-backend`
   - Verify ConfigMap/Secret values

### Monitoring Alerts

Set up alerts for:
- Health check failures
- High error rates (>5%)
- Memory/CPU usage >80%
- Socket connection drops
- Database connection issues

## 📚 Additional Resources

- [Prometheus Documentation](https://prometheus.io/docs/)
- [Grafana Documentation](https://grafana.com/docs/)
- [Kubernetes Documentation](https://kubernetes.io/docs/)
- [Sentry Documentation](https://docs.sentry.io/)