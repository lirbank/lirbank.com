---
title: "Liberate yourself from infrastructure over-planning"
description: "Challenge conventional wisdom before making hard decisions. Some one-way doors open both ways."
published: "2026-03-04"
updated: null
author: "Mikael Lirbank"
---

# Liberate yourself from infrastructure over-planning

Conventional wisdom says your backend and database should be on the same cloud provider. Crossing provider boundaries means crossing the internet, and crossing the internet means slow. It's a reasonable assumption. But if it's wrong, teams are giving up optionality for nothing. The freedom to make the right decision today, instead of trying to forecast what they need down the road.

I was migrating a client application to Cloudflare Workers. The database was Postgres on AWS. There's no managed Postgres on Cloudflare's infrastructure. If you want Postgres with Workers, cross-provider is the only option. That's supposed to be slow.

But is cross-provider slow because of the distance, or because of the internet? AWS and Cloudflare both have data centers in Ashburn. Distance is zero — does the internet hop alone actually matter?

So instead of switching platforms based on hearsay, I benchmarked it.

## The setup

I measured server-side response time. Worker-to-database, not client-to-server.

Every configuration hit the same Postgres database in us-east-1 (AWS) and ran the same queries. I varied three things: where the code runs, which driver it uses, and how it connects.

Three deployment targets:

| Target             | Provider   | Location | Role                |
| ------------------ | ---------- | -------- | ------------------- |
| Cloudflare Workers | Cloudflare | San Jose | Far (via internet)  |
| Cloudflare Workers | Cloudflare | Ashburn  | Near (via internet) |
| Vercel function    | AWS        | Ashburn  | Near (internal)     |

Four Postgres drivers:

| Driver        | npm package              | Protocol  | Transactions |
| ------------- | ------------------------ | --------- | ------------ |
| node-postgres | pg                       | TCP       | Interactive  |
| Postgres.js   | postgres                 | TCP       | Interactive  |
| neon-http     | @neondatabase/serverless | HTTP      | Batched only |
| neon-ws       | @neondatabase/serverless | WebSocket | Interactive  |

Three connection strategies:

| Connection | Description                                              |
| ---------- | -------------------------------------------------------- |
| unpooled   | Direct to Postgres                                       |
| pooled     | Through Neon's PgBouncer                                 |
| hyperdrive | Cloudflare's connection pooler (Cloudflare Workers only) |

Each configuration ran 25 iterations, with 2 warmup iterations. Two configuration choices dominate the results: where the Worker runs, and which driver it uses.

## Where the Workers run

The database is in Virginia. If the Worker runs in California, 4,000 km away, every query crosses the country. If the Worker runs in Virginia, the queries stay local. Same Cloudflare infrastructure, same internet hop to AWS, different distance.

The difference is not subtle.

### Transaction latency by driver and distance — pooled connection

| Driver        | Far (San Jose) | Near (Ashburn) | Improvement |
| ------------- | -------------- | -------------- | ----------- |
| node-postgres | 742ms          | 31ms           | 24x         |
| Postgres.js   | 880ms          | 38ms           | 23x         |
| neon-ws       | 537ms          | 40ms           | 13x         |
| neon-http     | 87ms           | 12ms           | 7x          |

[Summary statistics](https://github.com/starmode-base/serverless-db-latency/blob/main/results/2026-03-01T18-41-27-459Z-summary.md) · [Raw data](https://github.com/starmode-base/serverless-db-latency/blob/main/results/2026-03-01T18-41-27-459Z-raw.md)

A 23–24x improvement from geographic proximity alone. Each round-trip in the transaction multiplies the cross-country penalty.

Every cloud provider correctly tells you to put compute and database in the same region. They're right. That's the 23x difference. But that improvement came from geographic proximity alone. The Worker is still on Cloudflare, the database is still on AWS. The traffic still crosses the internet. If the region matters this much, how much does the provider matter?

## Which driver to use

If you don't need interactive transactions, neon-http is the fastest option. It sends queries as single HTTP requests. With the Worker near the database, queries hit 12ms. But neon-http only supports batched transactions — you can't read a row, make a decision based on it, then write within the same transaction. If your app needs that, neon-http is out. The remaining options are TCP and WebSocket drivers.

### Transaction latency by driver and connection — near the database

| Driver        | Connection | Time |
| ------------- | ---------- | ---- |
| node-postgres | hyperdrive | 27ms |
| node-postgres | pooled     | 31ms |
| Postgres.js   | hyperdrive | 34ms |
| node-postgres | unpooled   | 36ms |
| Postgres.js   | pooled     | 38ms |
| Postgres.js   | unpooled   | 39ms |
| neon-ws       | pooled     | 40ms |
| neon-ws       | unpooled   | 45ms |

[Summary statistics](https://github.com/starmode-base/serverless-db-latency/blob/main/results/2026-03-01T18-41-27-459Z-summary.md) · [Raw data](https://github.com/starmode-base/serverless-db-latency/blob/main/results/2026-03-01T18-41-27-459Z-raw.md)

Hyperdrive maintains pre-warmed connections, so the Worker skips connection setup on each invocation. That advantage shrinks with more round-trips. Connection setup is a smaller share of the total when you're doing four round-trips instead of one.

Variance matters too. The TCP drivers are consistent — p50 and average stay close. neon-ws is less predictable: transactions show a p50 of 40ms but an average of 49ms, with spikes past 120ms. For user-facing APIs, predictability matters as much as the median. The [summary statistics](https://github.com/starmode-base/serverless-db-latency/blob/main/results/2026-03-01T18-41-27-459Z-summary.md) include stddev and range for every configuration.

## Does the provider matter?

The Worker is close to the database, but the traffic still crosses the internet. How much does that cost compared to staying on the same internal network?

### Transaction latency — internet vs internal networking

| Driver        | Connection | Internet (Cloudflare) | Internal (Vercel) | Delta |
| ------------- | ---------- | --------------------- | ----------------- | ----- |
| node-postgres | pooled     | 31ms                  | 32ms              | -1ms  |
| Postgres.js   | pooled     | 38ms                  | 36ms              | +2ms  |
| neon-ws       | pooled     | 40ms                  | 31ms              | +9ms  |

[Summary statistics](https://github.com/starmode-base/serverless-db-latency/blob/main/results/2026-03-01T18-41-27-459Z-summary.md) · [Raw data](https://github.com/starmode-base/serverless-db-latency/blob/main/results/2026-03-01T18-41-27-459Z-raw.md)

For TCP drivers, the cross-provider penalty is -1ms to +2ms. In some configurations, Cloudflare is actually faster. The internet hop that was supposed to be the deal-breaker costs effectively nothing when both providers have data centers in the same metro area.

### Fastest option per platform

| Driver        | Internet (Cloudflare) | Internal (Vercel) | Delta |
| ------------- | --------------------- | ----------------- | ----- |
| node-postgres | 27ms (hyperdrive)     | 32ms (pooled)     | -5ms  |
| Postgres.js   | 34ms (hyperdrive)     | 36ms (pooled)     | -2ms  |
| neon-ws       | 40ms (pooled)         | 31ms (pooled)     | +9ms  |

Crossing the internet is actually 5ms faster than staying on the internal network in this benchmark.

## What this means

The cross-provider penalty is effectively zero, so you can defer infrastructure decisions, break dependencies between your compute and your data, and revisit either choice when the requirements change.

A few caveats. I tested one managed Postgres provider (Neon) in one region (us-east-1). The Vercel baseline runs on Fluid Compute, their layer on top of AWS Lambda. How much that affects per-query latency versus cold starts and concurrency is unclear. Other databases, other regions, and other providers may tell a different story.

---

Proximity matters enormously (23x). Provider boundaries don't (0ms). That's one less constraint to plan around. Now you know.
