# ============================
# 1. Builder Stage
# ============================
FROM node:20-bullseye AS builder
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy required project files
COPY prisma_clean ./prisma
COPY src ./src
COPY tsconfig*.json ./

# Generate Prisma client
RUN npx prisma generate

# Build TypeScript
RUN npm run build

# Remove dev dependencies
RUN npm prune --production


# ============================
# 2. Runtime Stage
# ============================
FROM node:20-bullseye AS runtime
WORKDIR /app

# Create non-root user
RUN addgroup --system concordia && adduser --system --ingroup concordia concordia

# Copy runtime artifacts
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

# ❗ DO NOT COPY prisma again — it overwrote your schema
# (This line was removed)
# COPY --from=builder /app/prisma ./prisma

# Permissions
RUN chown -R concordia:concordia /app
USER concordia

EXPOSE 4000
CMD ["node", "dist/main.js"]
