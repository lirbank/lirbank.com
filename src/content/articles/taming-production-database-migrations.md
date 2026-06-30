---
title: "Taming production database migrations"
description: "Use expand-and-contract to ship database migrations with confidence."
published: "2026-06-30"
updated: null
author: "Mikael Lirbank"
---

# Taming production database migrations

_Disclosure: [Neon](https://neon.com/) paid me to write this article. The argument and opinions are mine._

Production migrations are scary. But you can do it safely, without downtime or crashing clients.

Here's how.

## The two boundaries

Three things are in play.

- **Database.** Changed by migrations. A migration can change the schema, data, or both.
- **Server.** Changed by code deploys. It consumes the schema, exposes the API, and owns the mapping.
- **Clients.** Changed by user updates, reloads, installs, or not at all. They consume the API on their own schedule.

That gives you two boundaries.

- **Schema boundary.** Database <> server. The shared surface is the schema.
- **API boundary.** Server <> client. The shared surface is the API.

## Atomicity

The dream is to avoid coordinating schema and code at all. Change the schema, deploy the code, and have the whole thing land as one all-or-nothing operation.

You can get close at the schema boundary because you control both moving parts. You run the migration. You deploy the server. If you can afford to stop traffic for the release, or if you trust your rollback path, that can be a perfectly reasonable tradeoff. Plenty of smaller apps live there and do fine.

You cannot get that at the API boundary because you do not control clients in the wild. A breaking API change breaks every mobile app, desktop app, web app, and CLI until they update. Those clients move when they move.

That is the limit. Atomicity can buy simplicity where you control both sides. Expand-and-contract works everywhere because it does not need atomicity.

## Expand-and-contract

This is how you keep shipping with zero downtime, no broken clients, and no permanent compatibility cruft.

Expand-and-contract is a discipline where you change an interface in steps, so the provider and the consumer do not have to move at the same moment.

Instead of replacing the old shape with the new shape in one move, you keep the old shape working, add the new shape beside it, move consumers over, then remove the old shape.

At every step, every live consumer has a shape it understands.

## From principle to example

Consider a production system with a database, a server exposing a REST API, and clients that move on different schedules. The web app reloads quickly. The mobile app updates slowly. The desktop app and CLI may sit on old versions for a long time.

Now imagine you need to rename `users.bio` to `users.description` without breaking API clients that still use `bio`.

Current state.

- Database has `users.bio`
- API exposes `bio`
- Clients read and write `bio`

Target state.

- Database has `users.description`
- API exposes `description`
- Clients read and write `description`

The objective is to land the rename with zero downtime, no maintenance window, no crashed clients, and no permanent compatibility cruft. The old shape should be gone at the end, not carried forever as a tax on every future change.

The same rename crosses two boundaries. The schema side moves on your schedule. The API side moves on the clients' schedule.

## At the schema boundary

At the schema boundary, the consumer is your own server. That is why this part can finish quickly.

### Schema and data migrations

A _migration_ can change the _schema_, the _data_, or both. Schema changes alter the shape the server sees. Data changes move rows into that shape.

The objective is to keep the schema non-breaking at all times.

### Forward-only migrations

Prefer forward-only migrations. A down migration is often impossible and rarely tested well enough to trust under pressure. Instead, fix mistakes with another forward migration.

The rename at the schema boundary takes six moves. Each move is one logical change, a schema migration, a data migration, or a server deploy.

### Current state

This is the baseline. Everything is simple and aligned.

```txt
state
  API shape     { bio: string }
  DB schema     { bio: string }

server mapping
  read          api.bio ← db.bio
  write         api.bio → db.bio
```

### Move 1, schema expands

Run a schema migration that adds `description` as nullable.

```txt
state
  API shape     { bio: string }                            ← unchanged
  DB schema     { bio: string, description: string|null }  ← sparse

server mapping
  read          api.bio ← db.bio
  write         api.bio → db.bio
```

Old server code still reads and writes `bio`, and that remains legal. The new column exists, but nothing depends on it yet.

### Move 2, server follows

Deploy server code that starts dual-writing.

```txt
state
  API shape     { bio: string }                            ← unchanged
  DB schema     { bio: string, description: string|null }  ← sparse

server mapping
  read          api.bio ← db.bio
  write         api.bio → db.bio, db.description
```

The server still reads from `bio`, so old rows are fine. New writes fill both columns.

### Move 3, data catches up

Run a data migration that backfills `description = bio` where `description` is null.

```txt
state
  API shape     { bio: string }                            ← unchanged
  DB schema     { bio: string, description: string|null }  ← backfilled, in sync

server mapping
  read          api.bio ← db.bio
  write         api.bio → db.bio, db.description
```

The backfill can be batched and idempotent. The server is already dual-writing, so new writes keep both columns in sync while old rows catch up. If an old server instance writes during the rollout, rerun the backfill after the rollout finishes.

### Move 4, server moves reads

Deploy server code that reads from `description`.

```txt
state
  API shape     { bio: string }                            ← unchanged
  DB schema     { bio: string, description: string|null }  ← backfilled, in sync

server mapping
  read          api.bio ← db.description
  write         api.bio → db.bio, db.description
```

Notice that no server version reads both columns. Each version has one read path. Dual-write plus backfill are what make either read path correct during the transition.

### Move 5, server retreats

Deploy server code that stops writing `bio`.

```txt
state
  API shape     { bio: string }                            ← unchanged
  DB schema     { bio: string, description: string|null }  ← bio is now stale

server mapping
  read          api.bio ← db.description
  write         api.bio → db.description
```

This is the move that makes the next schema migration safe. The server stops writing the old column before the schema removes it.

### Move 6, schema contracts

Run a schema migration that drops `bio` and sets `description` to not null.

```txt
state
  API shape     { bio: string }  ← unchanged
  DB schema     { description: string }

server mapping
  read          api.bio ← db.description
  write         api.bio → db.description
```

None of those moves requires atomicity. Each move is safe because the state it leaves behind can be handled by every live server version that might see it.

Inside the schema boundary, the ordering rule is simple: schema first on expand, server first on contract. Add the column before the server writes it. Stop writing the column before the schema removes it.

The quiet win is that the API shape never changed. The database moved from `bio` to `description`, but clients still saw `{ bio }`. Nothing outside the server noticed.

That does not mean every migration needs this much choreography. Most migrations are additive. You add a column, add an index, add a table, and you are done. The longer sequence is the price of a breaking change.

## The server owns the seam

Clients never noticed the schema rename because clients never talk to the schema. They talk to the API.

Between the API and the schema sits the server. It consumes the schema, exposes the API, and owns the mapping between them. That mapping layer is the seam.

In the previous section, the database moved from `bio` to `description`, while the API kept exposing `bio`.

### Before the rename

The API field and database column shared an identifier.

```txt
server mapping
  read          api.bio ← db.bio
  write         api.bio → db.bio
```

### After the rename

The API field stayed `bio`, while the database column became `description`.

```txt
server mapping
  read          api.bio ← db.description
  write         api.bio → db.description
```

The mapping did not appear when the identifiers stopped matching. It was there from the beginning. Matching identifiers only made it less apparent.

The server-owned mapping layer decouples the two boundary changes. You can move the schema without changing the API, and vice versa. What matters is the order inside each boundary, not which boundary moves first.

The API boundary is different because its consumers are clients, and clients move on their own schedule. The schema boundary drains when your server fleet has adopted the new shape. The API boundary drains when your clients have adopted the new shape.

## At the API boundary

If you build with a meta-framework like [Next.js](https://nextjs.org/) or [TanStack Start](https://tanstack.com/start), it can feel like the API boundary disappears. Your client and server ship in one release, so how could they drift apart?

They drift the moment you ship. Deploying together is not upgrading together. The deploy replaces your server and publishes a new web client bundle. Every browser tab already open keeps running the bundle it loaded, and it keeps calling your server until the user reloads. That open tab is an installed client, frozen at its load-time version. A reload is a reinstall, just fast, and you do not decide when it happens.

Server functions do not change that. They hide the network call, not the API shape. Rename a field in what a server function returns and an old web client bundle can still break. A meta-framework makes the web client's compatibility window short, not gone. It does nothing for mobile, desktop, or CLI clients.

The database side is already done. The server maps the API to `description`, but the API still exposes `bio` to clients.

### Current state

```txt
state
  DB schema     { description: string }
  API supports  { bio: string }

clients
  all           api.bio ↔ db.description
```

Old clients still know `bio`. New clients need to move to `description`.

### Move 1, API expands

The API serves both `bio` and `description`, with the same value, and accepts either field on writes.

```txt
state
  DB schema     { description: string }
  API supports  { bio: string, description: string }

clients
  old           api.bio ↔ db.description
  new           api.description ↔ db.description
```

Old clients still see `bio`. New clients can start using `description`. Both are compatible because every live client has a shape it understands.

### Move 2, clients move

New client versions start using `description`. The web app is a browser tab reload away. Mobile gets a new version, and the long tail begins. The CLI gets a release too, but some users may not run it for a long time.

```txt
state
  DB schema     { description: string }
  API supports  { bio: string, description: string }

clients
  old           api.bio ↔ db.description
  new           api.description ↔ db.description
```

Only the API server runs expand-and-contract. The clients do not. They adopt the new shape whenever they happen to update.

That is the asymmetry. At the schema boundary, your server fleet converged in minutes. At the API boundary, your clients may take months or years, and you do not own the timing.

### Move 3, API contracts

Once you know no supported client still needs `bio`, remove it from the API.

```txt
state
  DB schema     { description: string }
  API supports  { description: string }

clients
  all           api.description ↔ db.description
```

That last move is the expensive one. Not technically expensive. Operationally expensive. You cannot safely drop `bio` merely because the new API exists. You have to wait until there are no old clients left to serve.

And now the cruft becomes real. Serving both fields is fine as a transition, but it should not be kept around forever. Every endpoint carries two shapes. Every client author sees two fields and wonders which is real. The schema boundary solved coordination quickly. The API boundary's cost is living with the gap, and the gap can stay open for a long time.

Endpoint versioning, `/v1` and `/v2`, does not remove the compatibility problem. It moves the old shape into a parallel API surface, and you still cannot delete `/v1` until the last old client is gone. Field-level expand-and-contract is the same discipline with less to carry.

That leaves one problem. To retire the old field from the API, you need to know when old clients are gone. The version gate is the clean way to find out.

## The version gate

A version gate has one job here. It tells you when the old API shape can be removed. It does not make clients automatically upgrade. It gives the server a way to tell outdated clients to upgrade before you remove the shape they still depend on.

A simple sketch using headers.

```txt
request
  x-version: ios/1.4.0

response
  x-latest-version: ios/1.6.0
  x-min-version: ios/1.4.0
```

The body stays normal. The version metadata rides beside it, like rate-limit headers.

You can implement the same idea other ways. What matters is that the server can see the client version, and the client can learn whether it is current, outdated, or too old to keep using the API.

### Freshness

In the header sketch, `x-latest-version` tells the client the current version. If the client sees that it is behind, it can show the familiar "there is a new version available" prompt. The client still works. The user can update now, update later, or ignore it.

That value moves with every release. It is about freshness, not compatibility.

### The minimum version

In the header sketch, `x-min-version` is the oldest client version the API is still compatible with. If the client sees that its version is below that floor, it should stop normal operation and show a blocking screen, "upgrade to continue". Letting it continue would mean asking the server for API shapes it no longer serves.

The minimum version does not move with every release. It moves when the upgrade window for an old shape has ended.

For the `bio` to `description` rename, suppose `ios/1.5.0` is the first mobile client that reads `description` instead of `bio`. Any supported version below `ios/1.5.0` still needs `bio`.

Keep serving `bio` while `x-min-version` is below `ios/1.5.0`. Once `x-min-version` is `ios/1.5.0` or higher, every supported client uses `description`, and the API can remove `bio`.

The cutoff matters. Without it, you know clients are upgrading, but you do not know which API shape each version still needs. The gate tells clients whether they may keep operating. The cutoff tells you when the old shape can die.

Without the full gate, logs are the fallback. If clients send versions, you can watch the real client-version distribution in production and remove the old shape when the old consumers disappear. That is observation, not control.

## When the schema is the API

There is a family of backendless and generated-API architectures where the client consumes the database schema directly, or through an API mechanically derived from it.

For migration purposes, they collapse the two boundaries into one client-facing surface.

In the two-boundary model, clients talk to your server, and your server talks to the database. The database shape stays behind the server.

In the one-boundary version, clients do not stop at a server-owned API. They consume a schema-shaped surface, maybe directly, maybe through a generated API.

[Supabase](https://supabase.com/) is the familiar Postgres example. You can expose tables through generated APIs, protect access with Postgres grants and Row Level Security, write less backend code, and ship faster. It removes ceremony and makes simple things simple.

The tradeoff is architectural. You can expose tables directly, or add a more deliberate database-owned API surface. Either way, there is no server-owned mapping layer hiding schema changes from clients. Compatibility has to live in the surface clients consume.

The version gate still tells you when the old shape is allowed to die. But old and new shapes now have to coexist where clients can see them. The heavier the schema change, the more expensive that gets.

## Expand-and-contract with confidence

Back at the database boundary, expand-and-contract makes each intermediate state safe. But a schema change can be valid against an empty database and still fail against production data, because the rows already stored have to satisfy the new schema too.

The usual answer is rehearsal. Clone production, run the migration, reset the clone, and try again. That works, but it is a separate step, so the safety check is easy to miss.

[Neon's Postgres branching](https://neon.com/branching) folds the rehearsal into the default workflow.

A Neon branch is an isolated copy of your production database. Developers can work against production-shaped schema and data without touching production.

Two features matter here.

- Instant branching gives you efficient copies of production data and schema for development and testing.
- Instant resets let you return a mutated branch to the current production state.

That changes the workflow.

- **Development.** Work on a mutable database branch isolated from production. Find production-shaped problems while the change is still being designed.
- **Preview, staging, and CI.** Run migrations against a fresh branch from production before code is promoted.
- **Production.** Promote with more confidence because the migration has already run against production-shaped data.

Branches do not make a breaking migration safe. Expand-and-contract does that. Branches make sure production is not the first place the change meets real data.

---

Keep every boundary compatible with its consumers. Make the migration meet real data before production does. That is how you ship with confidence. Now you know.
