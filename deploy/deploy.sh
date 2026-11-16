#!/usr/bin/env bash
# Her yayın (release) için çalıştırılacak deploy scripti.
# APP_USER (deploy) kullanıcısı olarak, uygulama dizininde çalıştırılır:
#   cd /var/www/lernzirkel && bash deploy/deploy.sh
set -euo pipefail

if [ ! -f .env.production ]; then
  echo "HATA: .env.production bulunamadı. deploy/.env.production.example'dan kopyalayıp doldurun." >&2
  exit 1
fi

echo "==> git pull"
git pull --ff-only origin main

echo "==> bağımlılıklar"
npm ci

echo "==> Prisma client üretimi"
npx prisma generate

echo "==> Şema senkronizasyonu (prisma db push — migration geçmişi netleşene kadar)"
set -a; source .env.production; set +a
npx prisma db push --skip-generate

echo "==> Production build"
NODE_OPTIONS="--max-old-space-size=2048" npm run build

echo "==> standalone çıktısına statik dosyaları ve .env'i kopyala"
# uploads/ hariç: Nginx onu doğrudan UPLOADS_DIR'den servis ediyor, Node'a kopyalanmasına
# gerek yok (ve her deploy'da büyüyen klasörü kopyalamamak build'i hızlandırır).
mkdir -p .next/standalone/public
rsync -a --delete --exclude 'uploads' public/ .next/standalone/public/
mkdir -p .next/standalone/.next
cp -r .next/static .next/standalone/.next/static
cp .env.production .next/standalone/.env.production

echo "==> PM2 ile sıfır kesintiye yakın yeniden başlatma"
if pm2 describe lernzirkel >/dev/null 2>&1; then
  pm2 reload deploy/ecosystem.config.js --update-env
else
  pm2 start deploy/ecosystem.config.js
fi
pm2 save

echo "==> Tamamlandı: $(date -Iseconds)"
