#!/usr/bin/env bash
# Manual deploy from your machine: rsync the working tree to the server, then rebuild there.
# (Pushing to master does the same thing automatically via GitHub Actions; see README.)
#
# Config (in .env.deploy or the environment):
#   DEPLOY_HOST  ssh host / alias            (required)
#   DEPLOY_DIR   remote directory            (default: dev/website-v2)
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

if [[ -f .env.deploy ]]; then
  set -a
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
ssh "$DEPLOY_HOST" "cd '$DEPLOY_DIR' && ./scripts/server-deploy.sh"

log "Deployed"
