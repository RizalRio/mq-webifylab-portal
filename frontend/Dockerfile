# Tahap 1: Builder
FROM node:18-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
# Jika butuh ENV saat build, definisikan di sini
RUN npm run build

# Tahap 2: Runner (Production)
FROM node:18-alpine AS runner
WORKDIR /app
ENV NODE_ENV production

# Mengambil hasil build mode standalone
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000
# Menjalankan server bawaan hasil standalone Next.js
CMD ["node", "server.js"]