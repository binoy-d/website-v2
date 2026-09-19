# binoy.co

Personal site: a React frontend plus a small Express API, packaged as two Docker containers and
started with a single `docker compose up`. Pushing to `master` deploys it.

```
.
├── src/, public/            React app (Create React App + react-router)
│   └── src/pages/Highlights  /highlights page: search, filter by book, expandable cards
├── server/                  Express API (Node 24): health + highlights from BookOrbit
├── nginx/default.conf       Serves the built site and proxies /api/* to the api container
├── Dockerfile               web image: builds the React app, serves it with nginx
├── server/Dockerfile        api image
├── compose.yaml             web + api
├── .github/workflows/       deploy.yml: test + build on GitHub, then deploy via self-hosted runner
├── scripts/server-deploy.sh Runs on the server: compose up --build + health check
├── scripts/deploy.sh        Manual deploy over ssh (rsync + server-deploy.sh)
├── scripts/kindle/          one-off: scrape old Kindle highlights and import them into BookOrbit (see its README)
└── Makefile                 shortcuts (`make deploy`, `make up`, `make logs`, ...)
```

## Deploying

**Push to `master`.** The `deploy` workflow runs the backend tests and the frontend build on
GitHub, then a self-hosted runner on the server (label `website`) pulls `master` into
`/home/daniel/dev/website-v2` and runs `scripts/server-deploy.sh`, which rebuilds the images,
restarts the containers and waits for `/api/health`. Progress is in the repo's Actions tab.
Re-run it by hand with `gh workflow run deploy` or the "Run workflow" button.

Manual fallbacks:

- From a machine with ssh access to the server: `make deploy` (rsyncs the working tree, then runs
  `server-deploy.sh` there). Needs `.env.deploy` with `DEPLOY_HOST`; see `.env.deploy.example`.
- On the server: `cd ~/dev/website-v2 && git pull && ./scripts/server-deploy.sh`.

The site is published on the server at `http://<server>:${WEB_PORT}` (default `8088`); a Cloudflare
Tunnel maps binoy.co to it. TLS is handled there, not in these containers.

### One-time runner setup (already done on binoyserver)

```bash
mkdir -p ~/actions-runner-website && cd ~/actions-runner-website
curl -sSfL -o runner.tar.gz https://github.com/actions/runner/releases/download/v2.337.0/actions-runner-linux-x64-2.337.0.tar.gz
tar xzf runner.tar.gz && rm runner.tar.gz
TOKEN=$(gh api -X POST repos/binoy-d/website-v2/actions/runners/registration-token --jq .token)
./config.sh --unattended --url https://github.com/binoy-d/website-v2 --token "$TOKEN" \
  --name binoyserver-website --labels website --work _work --replace
sudo ./svc.sh install daniel && sudo ./svc.sh start
```

The runner user needs to be in the `docker` group. Configuration (`.env`) lives on the server and
is never touched by deploys.

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

| Method | Path                            | Notes |
| ------ | ------------------------------- | ----- |
| GET    | `/api/health`                   | `{ status, version, uptime, highlights, timestamp }` |
| GET    | `/api/highlights`               | `?q=<words>&book=<bookId>&limit=12&offset=0&seed=<any>`. Search + filter over the cached BookOrbit highlights in a seeded random order that round-robins across books, so the first results come from different books and paging with the same seed is stable. Returns `{ total, offset, limit, seed, items[] }`; each item is `{ id, text, note, location, createdAt, origin, book: { id, title, author, coverUrl } }`. `503` until BookOrbit is configured |
| GET    | `/api/highlights/books`         | Books that have highlights: `{ books: [{ id, title, author, count, coverUrl }] }` |
| GET    | `/api/highlights/random`        | `?count=6` (max 24). Shortcut for a fresh random set: `{ highlights[] }` |
| GET    | `/api/highlights/cover/:bookId` | Book thumbnail, proxied from BookOrbit (only for books that appear in the highlights) |

The Highlights page pulls from a self-hosted [BookOrbit](https://github.com/bookorbit/bookorbit)
instance server-side (BookOrbit has no CORS in production and covers need auth). The api logs in
with the configured credentials, pages through `GET /api/v1/annotations`, caches the full list for
10 minutes, and answers searches and shuffles from that cache. Covers are cached for a day.

## Configuration (`.env`)

| Variable                                     | Default                            | Purpose |
| -------------------------------------------- | ---------------------------------- | ------- |
| `WEB_PORT`                                   | `8088`                             | Host port the site is published on |
| `WEB_BIND`                                   | `0.0.0.0`                          | Interface to bind; `127.0.0.1` to only allow a local proxy |
| `BOOKORBIT_URL`                              | `http://host.docker.internal:3000` | BookOrbit base URL as seen from the api container (empty disables highlights) |
| `BOOKORBIT_MAGIC_TOKEN`                      |                                    | Reusable BookOrbit magic-link token (preferred) |
| `BOOKORBIT_USERNAME` / `BOOKORBIT_PASSWORD`  |                                    | Alternative to the magic token |

---

Previous version: https://binoy-d.github.io/website-v1
