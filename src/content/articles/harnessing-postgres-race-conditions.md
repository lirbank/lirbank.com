---
title: "Harnessing Postgres race conditions"
description: "Synchronization barriers let you test for race conditions with confidence."
published: "2026-02-13"
updated: null
author: "Mikael Lirbank"
---

# Harnessing Postgres race conditions

Without race condition tests, every possible race condition in your system is one refactor away from hitting production.

Synchronization barriers let you write those tests with confidence.

## What a race condition looks like

You have a function that credits an account. It reads the current balance, adds an amount, and writes the new value back.

When two requests run this concurrently — two $50 credits to an account with a $100 balance — the timing can line up like this:

```
P1: SELECT balance → 100
P2: SELECT balance → 100
     ── both read 100, now both write based on it ──
P1: UPDATE balance = 150
P2: UPDATE balance = 150
```

Both read 100. Both compute 150. Both write 150. Final balance: $150 instead of $200. One $50 credit vanished. No error was raised. No transaction was rolled back. The database did exactly what it was told.

This is the shape of every write race condition: two operations read the same stale value, then both write based on it. The second write overwrites the first. In a system that handles money, that's a customer with a wrong balance and no error in any log to explain it.

## The testing challenge

Your test suite runs one request at a time. The interleaving above never happens. The test passes whether your code handles concurrency correctly or not.

Put the crediting logic in a function and run two calls concurrently:

```typescript
// Naive implementation — no transaction, no lock
const credit = async (accountId: number, amount: number) => {
  const [row] = await db.execute(
    sql`SELECT balance FROM accounts WHERE id = ${accountId}`,
  );
  const newBalance = row.balance + amount;
  await db.execute(
    sql`UPDATE accounts SET balance = ${newBalance} WHERE id = ${accountId}`,
  );
};

await Promise.all([credit(1, 50), credit(1, 50)]);
expect(result.balance).toBe(200); // passes — but we know the code has a race condition
```

You could add `sleep()` between the two queries to try to force the overlap. This buys you a slow, flaky test that sometimes catches the bug and sometimes doesn't. You could run the test a thousand times and hope the timing lines up at least once. Both approaches are the same bet — you're not testing concurrency, you're rolling dice.

What you need is a way to force two operations to read the same stale value before either writes. Every time. Not probabilistically.

You know this pattern exists. You know it's dangerous. The problem isn't knowledge. It's proof.

## Synchronization barriers

A barrier is a synchronization point for concurrent operations. You tell it how many tasks to expect. Each task runs independently until it hits the barrier, then waits. When the last task arrives, all of them are released at once.

```typescript
function createBarrier(count: number) {
  let arrived = 0;
  let release: () => void;

  const barrier = new Promise<void>((resolve) => {
    release = resolve;
  });

  return async () => {
    arrived++;

    if (arrived === count) {
      release();
    }

    await barrier;
  };
}
```

[Source code for `createBarrier`](https://github.com/starmode-base/neon-testing/blob/54e86d453158806fd4166e662361d82dd0955a81/src/barrier.ts)

A counter and a shared promise. Each caller increments the count. The last arrival resolves the promise. All callers await it — when it resolves, everyone proceeds. The function returns a barrier — call it and you're synchronized.

Place a barrier between the read and the write in concurrent code, and you force the exact interleaving from the previous section: every task reads before any task writes. That's the race condition, manufactured on demand.

## The barrier in action

[Runnable versions of every test in this section](https://github.com/starmode-base/neon-testing/blob/54e86d453158806fd4166e662361d82dd0955a81/examples/barriers/inline.test.ts)

Apply the barrier to the crediting function from earlier. Run the same test — two concurrent $50 credits — under three levels of protection. The results are instructive.

### 1. Bare queries

The simplest case: no transaction, just a SELECT and an UPDATE with a barrier between them:

```typescript
import { createBarrier } from "neon-testing/utils";

// Create a barrier that blocks until 2 tasks have arrived, then releases all of
// them at once.
const barrier = createBarrier(2);

const credit = async (accountId: number, amount: number) => {
  // Step 1: read the current balance
  const [row] = await db.execute(
    sql`SELECT balance FROM accounts WHERE id = ${accountId}`,
  );

  // Step 2: wait here until the other task has also read. This guarantees both
  // tasks read before either writes.
  await barrier();

  // Step 3: compute and write the new balance
  const newBalance = row.balance + amount;
  await db.execute(
    sql`UPDATE accounts SET balance = ${newBalance} WHERE id = ${accountId}`,
  );
};

// Run two $50 credits at the same time
await Promise.all([credit(1, 50), credit(1, 50)]);

// Check the final balance
const [result] = await db.execute(
  sql`SELECT balance FROM accounts WHERE id = 1`,
);
expect(result.balance).toBe(200); // fails — balance is 150, not 200
```

The test fails:

```
P1: SELECT balance → 100
P2: SELECT balance → 100
     ── barrier releases both ──
P1: UPDATE balance = 150
P2: UPDATE balance = 150

Expected: 200
Received: 150  ✗
```

The same interleaving from earlier, now happening inside your test suite. Deterministic. No timing tricks.

### 2. Adding transactions

Wrap the operation in a transaction:

```typescript
const credit = async (accountId: number, amount: number) => {
  // Same logic, now inside a transaction
  await db.transaction(async (tx) => {
    const [row] = await tx.execute(
      sql`SELECT balance FROM accounts WHERE id = ${accountId}`,
    );
    await barrier();
    const newBalance = row.balance + amount;
    await tx.execute(
      sql`UPDATE accounts SET balance = ${newBalance} WHERE id = ${accountId}`,
    );
  });
};
```

Same test, same barrier. Still fails:

```
T1: BEGIN
T1: SELECT balance → 100
T2: BEGIN
T2: SELECT balance → 100
     ── barrier releases both ──
T1: UPDATE balance = 150
T1: COMMIT
T2: UPDATE balance = 150
T2: COMMIT

Expected: 200
Received: 150  ✗
```

The transaction didn't help. Postgres's default isolation level is READ COMMITTED — each statement sees all data committed before that statement started.

A transaction gives you a consistent snapshot per statement. It does not give you a write lock. The barrier just proved these are different things.

### 3. Adding write locks

`SELECT ... FOR UPDATE` acquires a row-level lock at read time. Another transaction trying to lock the same row blocks until the first one commits:

```typescript
const credit = async (accountId: number, amount: number) => {
  await db.transaction(async (tx) => {
    const [row] = await tx.execute(
      sql`SELECT balance FROM accounts WHERE id = ${accountId} FOR UPDATE`, // lock the row
    );
    await barrier();
    const newBalance = row.balance + amount;
    await tx.execute(
      sql`UPDATE accounts SET balance = ${newBalance} WHERE id = ${accountId}`,
    );
  });
};
```

Same barrier, same test. Something different happens:

```
T1: BEGIN
T1: SELECT balance FOR UPDATE → 100 (acquires lock)
T2: BEGIN
T2: SELECT balance FOR UPDATE → ☐ blocked (waiting for T1's lock)
     ── T1 is at the barrier, waiting for T2.
        T2 is at the lock, waiting for T1.
        Neither can proceed. ──
```

The first task executes `SELECT ... FOR UPDATE` and acquires the lock. The second task tries the same query and blocks — it can't read the row until the first task releases the lock. The second task never reaches the barrier. The barrier is waiting for two tasks, but only one arrived.

The barrier deadlocks.

### 4. The deadlock

The deadlock proves the lock is there. You've validated the behavior. But a hanging test can't live in CI. The pragmatic response is to accept the proof and move on — remove the barrier, disable the test, whatever gets the suite green again.

That works until a refactor rewrites the query. Nothing catches the lost lock.

The deadlock is not a dead end. It's a signal that the barrier is in the wrong place.

### 5. Moving the barrier

Placing the barrier between read and write made sense for the earlier tests — it forced both tasks to read stale data before either could write, as we wanted. But with `FOR UPDATE`, the lock happens at read time.

The deadlock happened because one transaction held the lock while waiting at the barrier for the other — but the other was stuck on the lock and never arrived.

Move the barrier earlier — after BEGIN, before the SELECT — so both transactions have started before either tries to lock. Here's what happens with `FOR UPDATE` still in place:

```
T1: BEGIN
T2: BEGIN
     ── barrier releases both ──
T1: SELECT balance FOR UPDATE → 100    -- acquires lock
T2: SELECT balance FOR UPDATE           -- blocks (waiting for T1's lock)
T1: UPDATE balance = 150
T1: COMMIT                              -- releases lock
T2: SELECT balance FOR UPDATE → 150     -- reads updated value
T2: UPDATE balance = 200
T2: COMMIT

Expected: 200
Received: 200 ✓
```

The barrier releases both tasks into their SELECT simultaneously. `FOR UPDATE` serializes them — one gets the lock, the other waits. Which one goes first is arbitrary, but the result is the same: the second transaction reads the updated value. The test passes, runs to completion, and verifies the actual result.

The test passes. But we moved the barrier to fix the deadlock — does the test pass because of the lock, or because of the new barrier position? Remove the `FOR UPDATE` and find out:

```
T1: BEGIN
T2: BEGIN
     ── barrier releases both ──
T1: SELECT balance → 100
T2: SELECT balance → 100
T1: UPDATE balance = 150
T1: COMMIT
T2: UPDATE balance = 150
T2: COMMIT

Expected: 200
Received: 150 ✗
```

Same barrier, same position. Without the lock, both read stale data. The test fails — proof that the lock was doing the work. This is correct!

> **Important:** A correct barrier test passes with the lock and fails without it. If it doesn't do both, it proves nothing. Every time you change the barrier or the code it tests, verify both directions.

## Putting it to use

### Testing against a real database

These tests need a real Postgres instance — mocks have no locks, no transactions, no contention to reproduce. There are many ways to do this. I use [Neon Testing](https://www.npmjs.com/package/neon-testing), which also provides a `createBarrier` function.

### Injecting barriers with hooks

[Runnable version of the hooks pattern](https://github.com/starmode-base/neon-testing/blob/54e86d453158806fd4166e662361d82dd0955a81/examples/barriers/hooks.test.ts)

Barriers are test infrastructure — they shouldn't exist in production code. In the earlier examples, the barrier was baked into the function body. That works for a demonstration, but you need a way to inject the barrier only when running tests.

The solution is a hook: an optional callback that fires at the right point inside the transaction. Production callers don't pass it. Tests inject the barrier through it.

```typescript
async function credit(
  accountId: number,
  amount: number,
  hooks?: { onTxBegin?: () => Promise<void> | void },
) {
  await db.transaction(async (tx) => {
    if (hooks?.onTxBegin) {
      await hooks.onTxBegin();
    }
    const [row] = await tx.execute(
      sql`SELECT balance FROM accounts WHERE id = ${accountId} FOR UPDATE`,
    );
    const newBalance = row.balance + amount;
    await tx.execute(
      sql`UPDATE accounts SET balance = ${newBalance} WHERE id = ${accountId}`,
    );
  });
}
```

The hook fires after the transaction begins but before any queries execute. In production, `hooks` is undefined — the `if` check costs nothing. In tests, you pass the barrier:

```typescript
import { createBarrier } from "neon-testing/utils";

const barrier = createBarrier(2);
await Promise.all([
  credit(1, 50, { onTxBegin: barrier }),
  credit(1, 50, { onTxBegin: barrier }),
]);
const [result] = await db.execute(
  sql`SELECT balance FROM accounts WHERE id = 1`,
);
expect(result.balance).toBe(200);
```

Production code is unchanged:

```typescript
await credit(1, 50);
```

No hooks, no barrier, no overhead.

## Don't ship vanity tests

Six months from now, someone refactors the data access layer. The query gets rewritten, the function gets restructured, the lock gets lost in the shuffle. With barrier testing in your suite, that regression doesn't ship. The test fails before it leaves the developer's machine.

But only if the test actually catches the regression. Every time you change the barrier or the business logic — like moving the barrier to fix the deadlock — remove the lock and confirm the test fails. If it passes both ways, it's a vanity test.

---

Without barrier tests, every possible race condition in your system is one refactor away from hitting production. Now you know.
