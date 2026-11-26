# Lernzirkel imajı (Contabo VPS'teki paylaşımlı Docker platformu için). Hedefler:
#   runner  (varsayılan, SON aşama) Next.js uygulaması
#   tools   prisma db push / admin şifre oluşturma gibi tek seferlik işler

# ── Aşama 1: derleme ───────────────────────────────────────────────────────────
FROM node:20-alpine AS builder
# Prisma'nın schema-engine'i (tools aşamasında kullanılır) openssl ister
RUN apk add --no-cache openssl
WORKDIR /app

COPY package.json package-lock.json ./
COPY prisma ./prisma
RUN npm ci

COPY . .
RUN npx prisma generate

# NEXT_PUBLIC_* değerleri derleme anında istemci paketine gömülür; çalışma zamanı env'i yetmez.
ARG NEXT_PUBLIC_SITE_URL
ARG NEXT_PUBLIC_TURNSTILE_SITE_KEY
ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL \
    NEXT_PUBLIC_TURNSTILE_SITE_KEY=$NEXT_PUBLIC_TURNSTILE_SITE_KEY

RUN npm run build

# ── Araçlar: şema senkronizasyonu ve admin oluşturma (tam node_modules + prisma CLI) ─
FROM builder AS tools
ENV NODE_ENV=production
RUN npm install -g tsx@4.19.2

# ── Uygulama (SON aşama = varsayılan hedef) ──────────────────────────────────────
FROM node:20-alpine AS runner
RUN apk add --no-cache openssl
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Next.js standalone output
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

# Prisma client (generated)
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/prisma ./prisma

# Next.js çalışma anında .next/cache'e yazar (ISR, revalidateTag); nextjs kullanıcısı yazabilmeli
RUN mkdir -p .next/cache public/uploads depot-storage && chown -R nextjs:nodejs .next public/uploads depot-storage
# Konteyner kök dosya sistemi salt okunur çalışır (docker-compose.yml: read_only).
# Yazılabilir yerler: /tmp ve .next/cache (tmpfs), public/uploads + depot-storage (kalıcı volume'ler).

USER nextjs

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
