# Force rebuild 2026-05-29

# ---------- STAGE 1: BUILDER ----------
FROM node:20-bullseye AS builder

WORKDIR /app

COPY Concordia-Backend/package*.json ./
RUN npm ci

COPY Concordia-Backend ./
RUN npx prisma generate
RUN npm run build
RUN npm prune --production

# ---------- STAGE 2: RUNTIME ----------
FROM node:20-bullseye AS runtime

WORKDIR /app

COPY Concordia-Backend/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

RUN addgroup --system concordia && adduser --system --ingroup concordia concordia
RUN chown -R concordia:concordia /app
USER concordia

EXPOSE 4000

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl --fail --silent http://127.0.0.1:4000/health || exit 1

CMD ["node", "dist/index.js"]

# ---------- STAGE 3: WORKER ----------
FROM runtime AS worker

CMD ["node", "dist/worker.js"]
