# Library

## What this is

You sign in, drop files into your own library, poke around everyone else's, and grab copies of whatever's useful for yourself. Rails API in `server/`, React SPA in `client/`, both run through Docker Compose.

## Running it

```
docker compose up
```

```
docker compose exec server bin/rails db:create
docker compose exec server bundle exec rake ridgepole:apply
```

Schema comes from `db/Schemafile` via Ridgepole, not Rails migrations.

Client: http://localhost:5173
API: http://localhost:3000

## Creating users

```
docker compose exec -e EMAIL=alice@example.com -e PASSWORD=password123 server bin/rails users:create
docker compose exec -e EMAIL=bob@example.com -e PASSWORD=password123 server bin/rails users:create
```

Two accounts so you can try copying files and private file visibility between them.

## Running tests

```
docker compose exec server bundle exec rspec
```
