FROM node:20-slim AS builder

RUN apt-get update -y && apt-get install -y openssl ca-certificates && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma
RUN npm ci

RUN npx prisma generate

COPY tsconfig*.json ./
COPY src ./src
RUN npm run build \
  && mkdir -p dist/config \
  && cp src/config/branchGooglePlaces.json src/config/googleReviewsSnapshot.json dist/config/

FROM node:20-slim AS runtime

RUN apt-get update -y && apt-get install -y openssl ca-certificates && rm -rf /var/lib/apt/lists/*

WORKDIR /app

ENV NODE_ENV=production

COPY package*.json ./
RUN npm ci --omit=dev --ignore-scripts

COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma/client ./node_modules/@prisma/client
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/src/config/branchGooglePlaces.json ./dist/config/branchGooglePlaces.json
COPY --from=builder /app/src/config/googleReviewsSnapshot.json ./dist/config/googleReviewsSnapshot.json
COPY --from=builder /app/src/i18n/menu/locales ./dist/i18n/menu/locales
COPY prisma ./prisma

RUN mkdir -p /app/data && chown -R node:node /app/data

EXPOSE 4000

USER node

CMD ["node", "dist/index.js"]
