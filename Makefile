.PHONY: build up down restart logs cloc dev

build:
	docker compose build --no-cache

up:
	docker compose up -d

down:
	docker compose down

restart: down up

logs:
	docker compose logs -f

cloc:
	npx cloc src/

dev:
	npm run dev
