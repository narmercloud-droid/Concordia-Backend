FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --omit=dev

COPY . .

ENV NODE_ENV=production

EXPOSE 4000

CMD ["npm", "start"]
FROM node:20-slim AS builder

WORKDIR /app

# 1. Install dependencies (cached)
COPY package*.json ./
COPY prisma ./prisma
RUN npm ci --omit=dev

# 2. Generate Prisma client
RUN npx prisma generate

# 3. Copy source
COPY tsconfig*.json ./
COPY src ./src

# 4. Build
RUN npm run build

# 5. Production image
FROM node:20-slim AS runtime

WORKDIR /app

# Copy only what runtime needs
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY prisma ./prisma

USER node

CMD ["node", "dist/main.js"]
