# Builder
FROM node:20-bullseye AS builder
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npx prisma generate
RUN npm run build
RUN npm prune --production

# Runtime
FROM node:20-bullseye AS runtime
WORKDIR /app

RUN addgroup --system concordia && adduser --system --ingroup concordia concordia

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

RUN chown -R concordia:concordia /app
USER concordia

EXPOSE 4000
CMD ["node", "dist/main.js"]
