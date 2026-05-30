# 1. Base image
FROM node:20-bullseye AS builder

WORKDIR /app

# 2. Copy package files first
COPY package*.json ./

# 3. Copy prisma BEFORE npm ci
COPY prisma_clean ./prisma

# 4. Install dependencies (this runs postinstall → prisma generate)
RUN npm ci

# 5. Copy the rest of the source
COPY tsconfig*.json ./
COPY src ./src

# 6. Build
RUN npm run build

# 7. Prune dev deps
RUN npm prune --production
