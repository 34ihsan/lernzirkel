#!/usr/bin/env bash
# Günlük DB + upload yedeği. crontab ile çağrılır (bkz. deploy/crontab.example).
set -euo pipefail

BACKUP_DIR="/var/backups/lernzirkel"
KEEP_DAYS=14
DATE=$(date +%Y-%m-%d)

mkdir -p "$BACKUP_DIR"

echo "==> Postgres dump"
# .pgpass veya ~/.pg_service.conf kullanmak şifreyi komut satırından uzak tutar.
pg_dump -h localhost -U lernzirkel -d lernzirkel -F c -f "$BACKUP_DIR/db-$DATE.dump"

echo "==> Upload klasörü arşivi"
tar -czf "$BACKUP_DIR/uploads-$DATE.tar.gz" -C /var/www/lernzirkel/public uploads

echo "==> Eski yedekleri temizle (>$KEEP_DAYS gün)"
find "$BACKUP_DIR" -type f -mtime +"$KEEP_DAYS" -delete

echo "==> Tamamlandı: $BACKUP_DIR içinde $(ls "$BACKUP_DIR" | wc -l) dosya"

# Not: Bu, sunucunun kendi diskine yedek alır — sunucu tamamen kaybedilirse (disk arızası,
# yanlış 'rm -rf' vb.) işe yaramaz. Üretimde $BACKUP_DIR'i düzenli olarak sunucu dışına
# (örn. rclone ile bir S3/Backblaze bucket'ına, veya Contabo'nun kendi snapshot özelliğiyle)
# kopyalamanız şiddetle önerilir.
