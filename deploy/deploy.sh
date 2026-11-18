#!/usr/bin/env bash
# Lernzirkel'i sunucuda derleyip güncelleyen betik.
# Kullanım (sunucuda, /opt/sites/lernzirkel içinde, güncel kaynak kod yerindeyken):
#   bash deploy/deploy.sh
# Şema değişikliği otomatik UYGULANMAZ: gerekirse DEPLOYMENT.md'ye bakın
# (docker compose --env-file .env.production --profile tools run --rm tools npx prisma db push).
set -euo pipefail

cd "$(dirname "${BASH_SOURCE[0]}")/.."

[ -f .env.production ] || { echo "HATA: .env.production yok" >&2; exit 1; }
[ "$(stat -c %a .env.production)" = "600" ] || { echo "HATA: .env.production izni 600 olmalı" >&2; exit 1; }

export APP_TAG="${APP_TAG:-$(date +%Y%m%d-%H%M%S)}"
COMPOSE=(docker compose --env-file .env.production)

echo "==> Derleniyor (etiket: $APP_TAG)"
"${COMPOSE[@]}" build

echo "==> Başlatılıyor"
"${COMPOSE[@]}" up -d

echo "==> Durum"
"${COMPOSE[@]}" ps

# Son 3 etiketi tut, daha eskileri sil (geri dönüş için)
for img in lernzirkel-app lernzirkel-tools; do
  docker images "$img" --format '{{.Tag}}' | grep -v '^local$' | sort -r | tail -n +4 \
    | xargs -r -I{} docker rmi "$img:{}" || true
done
docker image prune -f >/dev/null
echo "Tamam. Geri dönmek için: APP_TAG=<eski-etiket> docker compose --env-file .env.production up -d"
