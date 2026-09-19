#!/usr/bin/env bash
# Deploy binoy.co to the server: rsync the repo, then `docker compose up -d --build` there.
#
# Config (in .env.deploy or the environment):
#   DEPLOY_HOST  ssh host / alias            (required)
#   DEPLOY_DIR   remote directory            (default: dev/website-v2)
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

if [[ -f .env.deploy ]]; then
  set -a; # export everything sourced
  # shellcheck disable=SC1091
  source .env.deploy
  set +a
fi

: "${DEPLOY_HOST:?Set DEPLOY_HOST in .env.deploy (see .env.deploy.example) or the environment}"
DEPLOY_DIR="${DEPLOY_DIR:-dev/website-v2}"

log() { printf '\n\033[1;36m==> %s\033[0m\n' "$*"; }

for tool in ssh rsync; do
  command -v "$tool" >/dev/null || { echo "error: '$tool' is required locally" >&2; exit 1; }
done

log "Syncing repo to ${DEPLOY_HOST}:${DEPLOY_DIR}"
ssh "$DEPLOY_HOST" "mkdir -p '$DEPLOY_DIR'"
rsync -az --delete --exclude-from="$ROOT/.rsyncignore" ./ "${DEPLOY_HOST}:${DEPLOY_DIR}/"

log "Building and starting containers on ${DEPLOY_HOST}"
ssh "$DEPLOY_HOST" bash -s -- "$DEPLOY_DIR" <<'REMOTE'
set -euo pipefail
cd "$1"

if [[ ! -f .env ]]; then
  cp .env.example .env
  echo "NOTE: created .env from .env.example. Edit $(pwd)/.env to set ADMIN_TOKEN / SMTP settings, then redeploy."
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
REMOTE

log "Deployed"
