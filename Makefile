.PHONY: deploy up down restart logs ps test-api dev-api dev-web

## Deploy to the server (see .env.deploy). This is the one command you need.
deploy:
	./scripts/deploy.sh

## Run the full stack locally with Docker (http://localhost:8088)
up: .env
	docker compose up -d --build

down:
	docker compose down

restart:
	docker compose restart

logs:
	docker compose logs -f --tail=100

ps:
	docker compose ps

.env:
	cp .env.example .env

## Development without Docker: run these in two terminals
dev-api:
	npm --prefix server run dev

dev-web:
	npm start

test-api:
	npm --prefix server test
