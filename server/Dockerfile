# ---- BUILDER ----
FROM node:20-bullseye AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# ---- RUNNER (Ubuntu with OpenSSL 1.1 support) ----
FROM node:20-bullseye AS runner

# Install OpenSSL 1.1 (works on bullseye)
RUN apt-get update -y && apt-get install -y openssl

WORKDIR /app

COPY --from=builder /app/package*.json ./
RUN npm ci --omit=dev

COPY --from=builder /app/prisma ./prisma
RUN npx prisma generate

COPY --from=builder /app/dist ./dist

EXPOSE 3000
CMD ["node", "dist/index.js"]
