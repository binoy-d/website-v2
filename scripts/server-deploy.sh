#!/usr/bin/env bash
# Runs ON the server from the repo directory: (re)build images, restart containers, wait for health.
# Used by scripts/deploy.sh (over ssh) and by .github/workflows/deploy.yml (self-hosted runner).
set -euo pipefail
cd "$(dirname "${BASH_SOURCE[0]}")/.."

if [[ ! -f .env ]]; then
  cp .env.example .env
  echo "NOTE: created .env from .env.example. Set BOOKORBIT_* in $(pwd)/.env to enable the Highlights page."
fi

docker compose up -d --build --remove-orphans
docker image prune -f >/dev/null || true
docker compose ps

PORT="$(grep -E '^WEB_PORT=' .env | tail -n1 | cut -d= -f2- | tr -d '[:space:]')"
PORT="${PORT:-8088}"
for _ in $(seq 1 30); do
  if curl -fsS "http://127.0.0.1:${PORT}/api/health" >/dev/null 2>&1; then
    echo "Health OK: http://127.0.0.1:${PORT}/api/health"
    exit 0
  fi
  sleep 2
done

echo "Health check did not pass within 60s. Recent logs:" >&2
docker compose logs --tail=60
exit 1
