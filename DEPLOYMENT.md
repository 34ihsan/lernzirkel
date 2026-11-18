# Contabo VPS Deployment

Bu proje Vercel'den Contabo VPS'e taşınıyor. Mimari: Nginx (TLS + reverse proxy) →
PM2 (Node process manager, cluster mode) → Next.js standalone build, yanında yerel
PostgreSQL ve kalıcı disk üzerinde dosya yüklemeleri.

```
İnternet → Nginx (443, TLS) → 127.0.0.1:3000 (PM2 → Next.js standalone, 2 instance)
                             ↘ /uploads, /_next/static → doğrudan diskten (Node'a gitmez)
                    PostgreSQL (localhost:5432)
```

## Neden bu mimari

- **PM2 cluster mode**: tek VPS'te birden fazla Node process'i, crash'te otomatik restart,
  sıfır downtime'a yakın reload (`pm2 reload`).
- **Nginx önde**: TLS sonlandırma, statik dosya/upload servisi (Node'u bypass eder,
  çok daha hızlı), gzip, güvenlik başlıkları.
- **Yerel PostgreSQL**: `DATABASE_URL` zaten `localhost` formatında tasarlanmıştı; VPS'i
  Almanya/AB lokasyonunda seçerseniz DSGVO veri yerelliği açısından da avantajlı.
- **Yerel disk upload**: Vercel (serverless) için S3'e taşıma gerekiyordu — VPS'te disk
  kalıcı olduğu için bu ihtiyaç ortadan kalktı. `UPLOADS_DIR` env değişkeniyle,
  her deploy'da yeniden build edilen `.next` klasöründen tamamen ayrı, sabit bir yolda
  tutuluyor (bkz. [src/app/api/upload/route.ts](src/app/api/upload/route.ts)).

## deploy/ klasöründeki dosyalar

| Dosya | Amaç |
|---|---|
| `setup-vps.sh` | Sunucunun tek seferlik ilk kurulumu (Node, PM2, Postgres, Nginx, Certbot, UFW, fail2ban, swap) |
| `deploy.sh` | Her yayın güncellemesinde çalıştırılır (git pull → build → pm2 reload) |
| `ecosystem.config.js` | PM2 process tanımı |
| `nginx.conf.example` | Nginx site config şablonu |
| `backup.sh` + `crontab.example` | Günlük DB/upload yedeği + cron endpoint'lerinin tetiklenmesi |
| `.env.production.example` | Sunucuda doldurulacak ortam değişkenleri şablonu |

## İlk kurulum

1. Contabo VPS'i sipariş edin (Almanya lokasyonu önerilir — DSGVO + gecikme).
   Ubuntu 22.04/24.04 LTS, en az 4GB RAM.
2. DNS: `lernzirkel-ludwigshafen.de` ve `www` A kaydını VPS IP'sine yönlendirin.
3. Sunucuya SSH ile bağlanıp:
   ```bash
   git clone <repo-url> /tmp/lernzirkel-setup
   sudo bash /tmp/lernzirkel-setup/deploy/setup-vps.sh
   ```
   Script size Postgres şifresi soracak ve script sonunda DATABASE_URL'i verecek.
4. SSL sertifikası:
   ```bash
   sudo certbot --nginx -d lernzirkel-ludwigshafen.de -d www.lernzirkel-ludwigshafen.de
   ```
5. `deploy` kullanıcısına geçip uygulamayı klonlayın ve ortam değişkenlerini doldurun:
   ```bash
   sudo -iu deploy
   git clone <repo-url> /var/www/lernzirkel
   cd /var/www/lernzirkel
   cp deploy/.env.production.example .env.production
   nano .env.production   # DATABASE_URL, AUTH_SECRET, CRON_SECRET, UPLOADS_DIR vb. doldurun
   bash deploy/deploy.sh
   ```
6. Admin kullanıcısını oluşturun (bunu bizzat siz çalıştırmalısınız — kimlik bilgisi
   oluşturma işlemini otomasyon dışı bıraktık):
   ```bash
   npx tsx scripts/setAdminPassword.ts admin@lernzirkel-ludwigshafen.de "<guclu-sifre>" "Admin"
   ```
7. Cron'ları kurun:
   ```bash
   crontab -e   # deploy/crontab.example içeriğini yapıştırıp __CRON_SECRET__'i değiştirin
   ```

## Sonraki deploy'lar

```bash
sudo -iu deploy
cd /var/www/lernzirkel
bash deploy/deploy.sh
```

`deploy.sh`: `git pull` → `npm ci` → `prisma generate` → `prisma db push` → `npm run build`
→ standalone klasörüne statik dosyaları kopyalar → `pm2 reload` (zero-downtime).

## Bilinen kısıtlar / sonraki adımlar

- **Prisma migration geçmişi**: Geliştirme sürecinde oluşan drift nedeniyle şema
  değişiklikleri `prisma db push` ile uygulanıyor (migration dosyası üretmiyor). Üretimde
  daha güvenli olan `prisma migrate deploy`'a geçmek için önce migration geçmişini
  (`prisma migrate resolve` ile) gerçek şemayla uzlaştırmak gerekir — ayrı bir iş kalemi.
- **Yedekleme**: `backup.sh` yedekleri sunucunun kendi diskine yazıyor. Sunucu/disk
  tamamen kaybedilirse işe yaramaz — düzenli olarak sunucu dışına (S3/Backblaze/Contabo
  snapshot) kopyalanması önerilir.
- **CI/CD otomasyonu**: Şu an deploy manuel (`deploy.sh`'i SSH ile çalıştırma). İsterseniz
  GitHub Actions ile push-on-main otomatik deploy eklenebilir — bunu kurmadım çünkü
  GitHub Secrets'a SSH deploy key eklemek sizin onayınızı gerektiren bir adım.
