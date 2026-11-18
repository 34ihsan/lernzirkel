#!/usr/bin/env bash
# /opt/sites/lernzirkel içindeki kaynak kodu GitHub'dan günceller (salt okunur deploy key).
# Kullanım:  bash deploy/pull.sh [dal]      (sonra: bash deploy/deploy.sh)
# Betik kendi dosyasını da güncelleyebildiğinden tüm gövde bir fonksiyonda çalışır.

main() {
  set -euo pipefail
  cd "$(dirname "${BASH_SOURCE[0]}")/.."
  local branch="${1:-${DEPLOY_BRANCH:-main}}"
  git fetch --depth 1 origin "$branch"
  git checkout -f -B deploy FETCH_HEAD
  git log -1 --format='güncellendi: %h %s'
}

main "$@"
exit $?
