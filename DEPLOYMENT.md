# Contabo VPS Deployment

Bu proje Contabo VPS'teki **paylaşımlı çok-site Docker platformuna** deploy edilir —
sunucuda tek bu site için ayrılmış bir nginx/PM2/Postgres kurulumu **değil**. Platform
(Traefik + Postgres + ağ izolasyonu) başka bir projeyle (StarWebFlow) birlikte zaten
kurulu ve çalışıyor; bu doküman sadece Lernzirkel'in o platforma nasıl bağlandığını anlatır.

```
Cloudflare (DNS · proxy ZORUNLU · TLS: DNS-01)
      │  yalnızca Cloudflare IP'leri origin'e ulaşabilir
┌─────▼───────────────────── Contabo VPS (169.58.207.93) ───────────────────────┐
│ /opt/platform/   → Traefik v3 (80/443, otomatik TLS), paylaşımlı Postgres 16  │
│                    + pgvector (her site kendi izole rolü/DB'siyle)            │
│ /opt/sites/lernzirkel/  → bu repo, docker-compose.yml ile `app` container'ı   │
│                           edge + data ağlarına bağlanır                      │
└────────────────────────────────────────────────────────────────────────────────┘
```

Platformun tam mimarisi, güvenlik kararları ve "yeni site ekleme" standart akışı
sunucuda `/opt/sites/starwebflow/docs/PLATFORM-ARCHITECTURE.md`'de belgelenmiştir
(bu repoya kopyalanmadı çünkü platforma özel, siteye özel değil).

## Neden bu mimari (lernzirkel özelinde)

- **Traefik + Docker label'ları**: nginx config dosyası elle yazılmaz; `docker-compose.yml`
  içindeki `traefik.*` label'ları yönlendirme + TLS'i otomatik kurar.
- **Cloudflare DNS-01**: certbot yok, `--nginx` doğrulaması yok. Ama bu yüzden **DNS kaydı
  Cloudflare'de proxied (turuncu bulut) olmak ZORUNDA** — Traefik origin'i yalnızca
  Cloudflare IP aralıklarından gelen istekleri kabul eder (bkz. `platform/traefik/dynamic.yml`
  `cloudflare-only` middleware'i). Gri bulut (DNS only) ile site 403 verir.
- **Paylaşımlı Postgres, site başına izole rol/DB**: `platform/scripts/create-site-db.sh`
  ile tek komutta oluşturulur; `lernzirkel` rolü yalnızca kendi DB'sini görebilir.
- **Kalıcı disk upload**: `public/uploads` bir Docker volume (`docker-compose.yml`), image
  her deploy'da yeniden build edilse de kaybolmaz. `UPLOADS_DIR` env değişkenine gerek yok
  (varsayılan `public/uploads` zaten konteynerin volume'üne denk geliyor).
- **read_only container + tmpfs**: ele geçirilse bile kalıcı ikili/betik bırakılamaz
  (bkz. `Dockerfile`, `docker-compose.yml` `x-hardening`).

## Bu repodaki deploy dosyaları

| Dosya | Amaç |
|---|---|
| `Dockerfile` | `runner` (uygulama) ve `tools` (prisma db push / admin oluşturma) hedefleri |
| `docker-compose.yml` | `app` servisi: Traefik label'ları, edge/data ağları, volume, healthcheck |
| `.dockerignore` | Build bağlamına girmemesi gerekenler (sırlar, .git, docs) |
| `deploy/.env.production.example` | Sunucuda doldurulacak ortam değişkenleri şablonu |
| `deploy/pull.sh` | Sunucuda: GitHub'dan (salt okunur deploy key ile) kodu günceller |
| `deploy/deploy.sh` | Sunucuda: `docker compose build && up -d`, eski image'leri temizler |
| `deploy/crontab.example` | Zamanlanmış yayın, anket davet/hatırlatma, JSON yedek — host crontab'ı |

## İlk kurulum

Platform (Traefik/Postgres) zaten ayakta; aşağıdakiler yalnızca **lernzirkel'e özel** adımlar.

### 1. Site veritabanı (bir kez)

```bash
cd /opt/platform
bash scripts/create-site-db.sh lernzirkel
```
Çıktıdaki `DATABASE_URL=...` satırını not edin (parola yalnızca bir kez gösterilir).

### 2. Kaynak kodu sunucuya alma (GitHub, salt okunur deploy key)

> **Durum: tamamlandı.** `deploy` kullanıcısı için `~/.ssh/lernzirkel_deploy` anahtarı
> üretildi, GitHub → `34ihsan/lernzirkel` → Deploy keys'e salt-okunur olarak eklendi, repo
> `/opt/sites/lernzirkel`'e çekildi (`deploy` dalı, `main`'den).

Sonraki güncellemelerde:
```bash
cd /opt/sites/lernzirkel
bash deploy/pull.sh
```
`.env.production` git'te olmadığı için güncellemelerden etkilenmez.

### 3. `.env.production`

Şablon: `deploy/.env.production.example`. Sunucuda `/opt/sites/lernzirkel/.env.production`,
izin `600`. Zorunlu: `SITE_HOST`, `SITE_HOST_ALT`, `DATABASE_URL` (adım 1'den),
`AUTH_SECRET`, `CRON_SECRET`, `NEXT_PUBLIC_SITE_URL`. Sırlar sohbete veya bu dosyaya
**yazılmaz** — sunucuda `openssl rand -base64 32` / `openssl rand -hex 32` ile üretilir.

### 4. Derleme ve şema (ilk kurulum)

```bash
cd /opt/sites/lernzirkel
docker compose --env-file .env.production build
docker compose --env-file .env.production --profile tools run --rm tools npx prisma db push
```
`db push` yalnızca BOŞ bir veritabanı için güvenlidir; veri içeren bir ortamda şema
değişikliği için migration planı gerekir (otomatik migrate yapılmaz).

### 5. İlk admin kullanıcısı

```bash
docker compose --env-file .env.production --profile tools run --rm tools \
  npx tsx scripts/setAdminPassword.ts admin@lernzirkel-ludwigshafen.de "<guclu-sifre>" "Admin"
```

### 6. Başlatma ve doğrulama

```bash
docker compose --env-file .env.production up -d
docker compose --env-file .env.production ps     # app: healthy
docker logs lernzirkel-app-1 --tail 30
```
Windows PowerShell'de:
```powershell
curl.exe -sI https://www.lernzirkel-ludwigshafen.de/api/health    # 200, Server: cloudflare
```
`Server: cloudflare` ve `cf-ray` başlıkları yoksa kayıt hâlâ gri bulut (DNS only) demektir —
bkz. Domain/Cloudflare bölümü.

### 7. Cron'ları kurun

```bash
crontab -u deploy -e   # deploy/crontab.example içeriğini yapıştırıp __CRON_SECRET__'i değiştirin
mkdir -p /var/log/lernzirkel
```

## Sonraki deploy'lar

```bash
cd /opt/sites/lernzirkel
bash deploy/pull.sh
bash deploy/deploy.sh
```
`deploy.sh`: `docker compose build` → `up -d` (zero-downtime'a yakın) → son 3 image
etiketinden eskilerini siler. Geri dönüş: `APP_TAG=<eski-etiket> docker compose --env-file
.env.production up -d`.

CI/CD şu an yok (manuel deploy, SSH ile). Repo `main`'e her push'ta GitHub Actions ile
otomatik deploy istenirse, platformun kendi GH Actions deploy akışı örnek alınabilir
(`/opt/sites/starwebflow/.github/workflows/deploy.yml` — şu an orada da bilinçli olarak
`workflow_dispatch`'e kısıtlanmış, yalnızca elle tetiklenir).

## Domain / Cloudflare

Domain `www.lernzirkel-ludwigshafen.de` (canonical) + `lernzirkel-ludwigshafen.de` (apex,
www'ye 301 yönlendirilir — `docker-compose.yml` label'ları). Platformun `CF_DNS_API_TOKEN`'ı
(`/opt/platform/.env`) aynı Cloudflare hesabındaki zone'lar için ACME DNS-01 kullanır.

1. `lernzirkel-ludwigshafen.de` Cloudflare'de zone olarak eklenmeli (starwebflow ile aynı hesap).
2. Registrar'da nameserver'lar Cloudflare'inkine çevrilmeli.
3. DNS kayıtları: `@` ve `www` → `169.58.207.93`, **Proxy: turuncu bulut (ZORUNLU)**.
4. Cloudflare SSL/TLS modu: **Full (strict)**.
5. `CF_DNS_API_TOKEN`'ın yetki kapsamı bu yeni zone'u içermeli (mevcut token "All zones"
   kapsıyorsa ek işlem gerekmez; belirli zone'lara kısıtlıysa genişletilmeli).
6. `docker compose up -d` sonrası Traefik ilk isteği aldığında sertifikayı otomatik alır
   (certbot/certbot.timer YOK — bu adım tamamen otomatik).

## Bilinen kısıtlar / sonraki adımlar

- **Yedekleme**: Platform seviyesinde günlük `pg_dump` + `restic` → Backblaze B2
  (`/opt/platform/scripts/backup-restic.sh`). Bu script'in site listesine `lernzirkel`'in
  eklenip eklenmediği doğrulanmalı — eklenmemişse DB'si otomatik yedeklenmez.
- **Prisma migration geçmişi**: Şema değişiklikleri `prisma db push` ile uygulanıyor
  (migration dosyası üretmiyor). Üretimde daha güvenli olan `prisma migrate deploy`'a geçmek
  için önce migration geçmişini gerçek şemayla uzlaştırmak gerekir — ayrı bir iş kalemi.
- **CI/CD otomasyonu**: Şu an deploy manuel (SSH ile `pull.sh` + `deploy.sh`). GitHub Actions
  ile otomatik deploy eklenebilir, ama GitHub Secrets'a SSH deploy key eklemek onay gerektirir.
