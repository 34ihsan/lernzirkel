// PM2 process manager config.
// Çalıştırma: pm2 start deploy/ecosystem.config.js
module.exports = {
  apps: [
    {
      name: 'lernzirkel',
      // Next.js'in resmi standalone çalıştırma şekli: cwd = standalone klasörünün kendisi
      // (server.js içindeki statik dosya yolları buna göre çözülüyor — cwd'yi app root
      // yapmak .next/static ve public çözümlemesini bozar).
      script: 'server.js',
      cwd: '/var/www/lernzirkel/.next/standalone',
      instances: 2, // küçük VPS'lerde (2-4 vCPU) güvenli varsayılan; nproc'a göre artırılabilir
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
        HOSTNAME: '127.0.0.1', // sadece localhost'ta dinle, Nginx proxy yapar
      },
      max_memory_restart: '600M',
      autorestart: true,
      // Next.js standalone server.js açılışta cwd'deki .env.production dosyasını kendisi okur
      // (bkz. /var/www/lernzirkel/.env.production) — PM2'ye ayrıca env_file vermeye gerek yok.
      out_file: '/var/log/lernzirkel/out.log',
      error_file: '/var/log/lernzirkel/error.log',
      time: true,
    },
  ],
};
