#!/usr/bin/env bash
# Contabo VPS ilk kurulum scripti — Ubuntu 22.04/24.04 LTS için.
#
# Bu scripti kör kör çalıştırmayın: önce okuyun, DOMAIN ve APP_USER değerlerini
# kontrol edin. Root olarak (veya sudo ile) tek seferlik çalıştırılır.
#
# Kullanım: sudo bash deploy/setup-vps.sh
set -euo pipefail

DOMAIN="lernzirkel-ludwigshafen.de"
APP_USER="deploy"
APP_DIR="/var/www/lernzirkel"
NODE_MAJOR=20

echo "==> Sistem güncelleniyor"
apt-get update -y && apt-get upgrade -y

echo "==> Swap alanı (küçük/orta VPS'lerde build sırasında OOM'u önler)"
if [ ! -f /swapfile ]; then
  fallocate -l 4G /swapfile
  chmod 600 /swapfile
  mkswap /swapfile
  swapon /swapfile
  echo '/swapfile none swap sw 0 0' >> /etc/fstab
  sysctl -w vm.swappiness=10
  echo 'vm.swappiness=10' >> /etc/sysctl.conf
else
  echo "    /swapfile zaten var, atlanıyor."
fi

echo "==> Temel araçlar"
apt-get install -y rsync curl ca-certificates gnupg

echo "==> UFW güvenlik duvarı"
apt-get install -y ufw
ufw allow OpenSSH
ufw allow 80/tcp
ufw allow 443/tcp
ufw --force enable

echo "==> fail2ban (SSH brute-force koruması)"
apt-get install -y fail2ban
systemctl enable --now fail2ban

echo "==> Node.js ${NODE_MAJOR}.x (NodeSource)"
curl -fsSL "https://deb.nodesource.com/setup_${NODE_MAJOR}.x" | bash -
apt-get install -y nodejs
npm install -g pm2

echo "==> PostgreSQL"
apt-get install -y postgresql postgresql-contrib
systemctl enable --now postgresql

echo "    -> 'lernzirkel' veritabanı ve kullanıcısı için şifre girin (saklanmaz, sadece DB'ye yazılır):"
read -s -p "    Postgres şifresi: " DB_PASSWORD
echo
sudo -u postgres psql -v ON_ERROR_STOP=1 <<SQL
DO \$\$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'lernzirkel') THEN
    CREATE ROLE lernzirkel LOGIN PASSWORD '${DB_PASSWORD}';
  END IF;
END
\$\$;
SELECT 'CREATE DATABASE lernzirkel OWNER lernzirkel'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'lernzirkel')\gexec
SQL
echo "    DATABASE_URL=postgresql://lernzirkel:<sifre>@localhost:5432/lernzirkel olacak — .env.production'a bunu yazın."

echo "==> Nginx + Certbot"
apt-get install -y nginx certbot python3-certbot-nginx
mkdir -p /var/www/certbot

echo "==> Uygulama kullanıcısı ve dizinleri"
if ! id -u "$APP_USER" >/dev/null 2>&1; then
  useradd --system --create-home --shell /bin/bash "$APP_USER"
fi
mkdir -p "$APP_DIR" /var/log/lernzirkel
chown -R "$APP_USER:$APP_USER" "$APP_DIR" /var/log/lernzirkel

echo "==> Nginx site config"
sed "s/lernzirkel-ludwigshafen.de/${DOMAIN}/g" "$(dirname "$0")/nginx.conf.example" > /etc/nginx/sites-available/"$DOMAIN"
ln -sf /etc/nginx/sites-available/"$DOMAIN" /etc/nginx/sites-enabled/"$DOMAIN"
rm -f /etc/nginx/sites-enabled/default
nginx -t && systemctl reload nginx

echo "==> PM2'yi $APP_USER için systemd servisi olarak başlatıyor"
env PATH=$PATH:/usr/bin pm2 startup systemd -u "$APP_USER" --hp "/home/$APP_USER" | tail -n1 | bash || true

cat <<EOF

=========================================================
Sunucu temel kurulumu tamamlandı. Sıradaki adımlar:

1) DNS: ${DOMAIN} A kaydını bu VPS'in IP'sine yönlendirin.
2) SSL sertifikası alın:
     sudo certbot --nginx -d ${DOMAIN} -d www.${DOMAIN}
3) ${APP_USER} kullanıcısına geçip uygulamayı deploy edin:
     sudo -iu ${APP_USER}
     git clone <repo-url> ${APP_DIR}
     cd ${APP_DIR}
     cp deploy/.env.production.example .env.production   # sonra gerçek değerleri doldurun
     bash deploy/deploy.sh
4) Cron'ları kurun: crontab -u ${APP_USER} -e  (bkz. deploy/crontab.example)
=========================================================
EOF
