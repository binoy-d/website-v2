# binoy.co

Personal site: a React frontend plus a small Express API, packaged as two Docker containers and
started with a single `docker compose up`.

```
.
├── src/, public/          React app (Create React App)
├── server/                Express API — contact form, health check (Node 24, SQLite via node:sqlite)
├── nginx/default.conf     Serves the built site and proxies /api/* to the api container
├── Dockerfile             web image: builds the React app, serves it with nginx
├── server/Dockerfile      api image
├── compose.yaml           web + api + a volume for the SQLite database
├── scripts/deploy.sh      rsync to the server, `docker compose up -d --build`, health check
└── Makefile               shortcuts (`make deploy`, `make up`, `make logs`, ...)
```

## Deploy

One-time setup:

1. `cp .env.deploy.example .env.deploy` and set `DEPLOY_HOST` to your SSH host/alias.
2. On the server: Docker (with the compose plugin), `rsync`, and `curl` installed, and your SSH key authorized.

Then, every time:

```bash
make deploy
```

That rsyncs the repo to `DEPLOY_DIR` on the server (skipping `.git`, `node_modules`, `.env`), runs
`docker compose up -d --build --remove-orphans` there, prunes dangling images, and waits for
`/api/health` to respond. `npm run deploy` does the same thing.

The first deploy creates `.env` on the server from `.env.example`. Edit it there to set `ADMIN_TOKEN`
and (optionally) SMTP settings, then run `make deploy` again to apply.

The site is published on the server at `http://<server>:${WEB_PORT}` (default `8088`). Point your
reverse proxy or Cloudflare Tunnel at that port; TLS is handled there, not in these containers.

## Run with Docker anywhere

```bash
cp .env.example .env      # or `make up`, which does this for you
docker compose up -d --build
open http://localhost:8088
```

## Local development (no Docker)

Needs Node 22.13+ (24 recommended). Two terminals:

```bash
npm --prefix server install && make dev-api   # API on http://localhost:4000, auto-restarts on change
```

```bash
npm install && make dev-web                    # CRA on http://localhost:3000, proxies /api to :4000
```

Backend tests: `make test-api`.

## API

| Method | Path                      | Notes                                                                                   |
| ------ | ------------------------- | --------------------------------------------------------------------------------------- |
| GET    | `/api/health`             | `{ status, version, uptime, timestamp }`                                                |
| POST   | `/api/contact`            | Body `{ name, email, message }`. `201 { ok, id }`, `400 { error, details[] }`, `429` when rate-limited |
| GET    | `/api/admin/messages`     | `Authorization: Bearer $ADMIN_TOKEN`. `?limit=50` (max 500). Returns `{ total, messages[] }`. `404` if no token configured |
| GET    | `/api/highlights/random` | `?count=6` (max 24). Random highlights from BookOrbit: `{ highlights: [{ id, text, note, location, createdAt, book: { id, title, author, coverUrl } }] }`. `503` until BookOrbit is configured |
| GET    | `/api/highlights/cover/:bookId` | Book thumbnail, proxied from BookOrbit (only for books that appear in the highlights) |

Contact submissions are always stored in SQLite. If SMTP is configured they are also emailed to
`CONTACT_TO`. A hidden honeypot field and a per-IP rate limit (5/hour by default) keep bots out.

The Highlights page (`/highlights`) pulls from a self-hosted [BookOrbit](https://github.com/bookorbit/bookorbit)
instance server-side (BookOrbit has no CORS in production and covers need auth). The api logs in with the
configured credentials, pages through `GET /api/v1/annotations`, caches the full list for 10 minutes, and
serves random picks from that cache. Covers are cached for a day.

Read your messages:

```bash
curl -H "Authorization: Bearer $ADMIN_TOKEN" https://binoy.co/api/admin/messages | jq
```

## Configuration (`.env`)

| Variable                   | Default                | Purpose                                                   |
| -------------------------- | ---------------------- | --------------------------------------------------------- |
| `WEB_PORT`                 | `8088`                 | Host port the site is published on                        |
| `WEB_BIND`                 | `0.0.0.0`              | Interface to bind; `127.0.0.1` to only allow a local proxy |
| `ADMIN_TOKEN`              | empty (disabled)       | Bearer token for `/api/admin/messages`                    |
| `SMTP_HOST` / `SMTP_PORT`  | empty (disabled) / 587 | SMTP server for email notifications                       |
| `SMTP_USER` / `SMTP_PASS`  |                        | SMTP credentials                                          |
| `CONTACT_TO`               | `dbinoy15@gmail.com`   | Where notifications go                                    |
| `CONTACT_FROM`             | `SMTP_USER`            | From address                                              |
| `CONTACT_RATE_MAX`         | `5`                    | Contact submissions allowed per IP per window             |
| `CONTACT_RATE_WINDOW_MS`   | `3600000`              | Rate-limit window (ms)                                    |
| `BOOKORBIT_URL`            | `http://host.docker.internal:3000` | BookOrbit base URL as seen from the api container (empty disables highlights) |
| `BOOKORBIT_MAGIC_TOKEN`    |                        | Reusable BookOrbit magic-link token (preferred)            |
| `BOOKORBIT_USERNAME` / `BOOKORBIT_PASSWORD` |       | Alternative to the magic token                            |

## Data

The SQLite database lives in the `api-data` Docker volume at `/data/app.db`. Back it up with:

```bash
docker compose cp api:/data/app.db ./app-backup.db
```

---

Previous version: https://binoy-d.github.io/website-v1
