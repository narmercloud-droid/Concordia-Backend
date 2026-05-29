# ---------- STAGE 1: BUILDER ----------
FROM node:20-bullseye AS builder

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy full source
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build TypeScript → dist/
RUN npm run build

# Remove dev dependencies
RUN npm prune --production

# ---------- STAGE 2: RUNTIME ----------
FROM node:20-bullseye AS runtime

WORKDIR /app

# Copy only what runtime needs
COPY package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

# Create non-root user
RUN addgroup --system concordia && adduser --system --ingroup concordia concordia
RUN chown -R concordia:concordia /app
USER concordia

EXPOSE 4000

# Healthcheck
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl --fail --silent http://127.0.0.1:4000/health || exit 1

# Default command: API server
CMD ["node", "dist/index.js"]

# ---------- STAGE 3: WORKER ----------
FROM runtime AS worker

CMD ["node", "dist/worker.js"]
