---
title: Postgres bugs that cost money and leave no trace
description: Every race condition you've ever fixed is one refactor away from coming back. Synchronization barriers change that.
published: "2026-02-10"
updated: null
---

# Postgres bugs that cost money and leave no trace

Every race condition you've ever fixed is one refactor away from coming back. And your test suite can't catch it.

Synchronization barriers change that. They let you force concurrent operations to interleave in exactly the dangerous order — deterministically, every time.

## What a race condition looks like

Say you have a function that credits an account. It reads the current balance, adds an amount, and writes the new value back. (Yes, this specific case could be a single `UPDATE balance = balance + 50`. The pattern matters when the computation can't be expressed as one statement — which is most real-world cases.)

When two requests run this concurrently — two $50 credits to an account with a $100 balance — here's what happens:

```
T1: SELECT balance → 100
T2: SELECT balance → 100
T1: UPDATE balance = 150
T2: UPDATE balance = 150
```

Both read 100. Both compute 150. Both write 150. Final balance: $150 instead of $200. One credit vanished. No error was raised. No transaction was rolled back. The database did exactly what it was told.

This is the shape of every write race condition: two operations read the same stale value, then both write based on it. The second write overwrites the first. In a system that handles money, that's a customer with a wrong balance and no error in any log to explain it.

## The testing gap

You know this pattern exists. You handle it — `SELECT ... FOR UPDATE`, proper locking, the right isolation level. The problem isn't knowledge. It's proof.

Your test suite runs one request at a time. The interleaving above never happens. The test passes with the locking, and it passes without it. If someone refactors the query and drops the `FOR UPDATE`, every test stays green. The race condition is back in production and nothing in your CI pipeline tells you.

You could add `sleep()` calls to try to force the overlap. This buys you a slow, flaky test that sometimes catches the bug and sometimes doesn't, depending on how busy the CI server is. You're not testing concurrency — you're rolling dice.

What you need is a way to force two operations to read the same stale value before either writes. Every time. Not probabilistically.

## Barriers

A barrier is a synchronization point for concurrent operations. You tell it how many tasks to expect. Each task runs independently until it hits the barrier, then waits. When the last task arrives, all of them are released at once.

[DIAGRAM: two tasks running independently, both hitting the barrier, waiting, then released simultaneously]

```typescript
function createBarrier(count: number) {
  let arrived = 0;
  const waiters: (() => void)[] = [];

  return async () => {
    arrived++;
    if (arrived === count) {
      waiters.forEach((resolve) => resolve());
    } else {
      await new Promise<void>((resolve) => waiters.push(resolve));
    }
  };
}
```

A counter and a list of waiters. Each caller increments the count. If it's not the last, it waits. When the last arrives, everyone is released. The function returns a barrier — call it and you're synchronized.

Place a barrier between the read and the write in concurrent code, and you force the exact interleaving from the previous section: every task reads before any task writes. That's the race condition, manufactured on demand.

## Putting it to work

Here's the crediting function under three levels of protection: no transactions, transactions, and `SELECT ... FOR UPDATE`. Same barrier, same test, same two concurrent $50 credits. The barrier shows what each level actually does.

### No transactions

The simplest case: no transaction, just a SELECT and an UPDATE with a barrier between them:

```typescript
const barrier = createBarrier(2);

const credit = async (accountId: number, amount: number) => {
  const [row] = await db.execute(
    sql`SELECT balance FROM accounts WHERE id = ${accountId}`,
  );
  await barrier();
  const newBalance = row.balance + amount;
  await db.execute(
    sql`UPDATE accounts SET balance = ${newBalance} WHERE id = ${accountId}`,
  );
};

await Promise.all([credit(1, 50), credit(1, 50)]);
const [result] = await db.execute(
  sql`SELECT balance FROM accounts WHERE id = 1`,
);
expect(result.balance).toBe(200);
```

The test fails:

```
T1: SELECT balance → 100
T2: SELECT balance → 100
     ── barrier releases both ──
T1: UPDATE balance = 150
T2: UPDATE balance = 150

Expected: 200
Received: 150
```

The same interleaving from earlier, now happening inside your test suite. Deterministic. No timing tricks.

### Adding transactions

Wrap the operation in a transaction:

```typescript
const credit = async (accountId: number, amount: number) => {
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
Received: 150
```

The transaction changed nothing. Postgres's default isolation level is READ COMMITTED — each statement sees all data committed before that statement started.

A transaction gives you a consistent snapshot per statement. It does not give you a write lock. The barrier just proved these are different things.

### Adding FOR UPDATE

`SELECT ... FOR UPDATE` acquires a row-level lock at read time. The second transaction can't read the same row until the first one commits:

```typescript
const credit = async (accountId: number, amount: number) => {
  await db.transaction(async (tx) => {
    const [row] = await tx.execute(
      sql`SELECT balance FROM accounts WHERE id = ${accountId} FOR UPDATE`,
    );
    await barrier();
    const newBalance = row.balance + amount;
    await tx.execute(
      sql`UPDATE accounts SET balance = ${newBalance} WHERE id = ${accountId}`,
    );
  });
};
```

Same test. Something different happens.

The first task executes `SELECT ... FOR UPDATE` and acquires the lock. The second task tries the same query and blocks — it can't read the row until the first task releases the lock. The second task never reaches the barrier. The barrier is waiting for two tasks, but only one arrived.

The barrier deadlocks.

## Don't accept the deadlock

The deadlock proves the lock is there. You've validated the behavior. But a hanging test can't live in CI. So what do you do? If you don't know the next step, the natural response is to accept the proof and move on — remove the barrier, disable the test, whatever gets the suite green again.

And now you have no regression protection. When someone removes the `FOR UPDATE` six months from now, nothing catches it. The proof is gone. The lock is gone. The race condition is back.

The deadlock is not a dead end. It's a signal that the barrier is in the wrong place.

## Moving the barrier

The barrier between read and write made sense for the earlier tests — it forced both tasks to read stale data before either could write. But with `FOR UPDATE`, the lock happens at read time.

The key thing: both transactions need to be running before either tries to lock. That's what happens in production — two requests arrive at the same time, both start transactions, and then the lock decides who goes first. If your test doesn't reproduce that condition, it's not testing contention.

That means the barrier goes earlier. Place it after BEGIN but before the SELECT. The goal is both transactions running before either tries to lock.

With `FOR UPDATE`:

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

Result: 200 ✓
```

The barrier releases both tasks into their SELECT simultaneously. `FOR UPDATE` serializes them — T1 gets the lock, T2 waits at the SELECT. When T1 commits, T2 reads the updated value and computes correctly. The test passes, runs to completion, and verifies the actual result.

Without `FOR UPDATE`:

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
Received: 150
```

Same barrier, same position. Without the lock, both read stale data. Test fails.

This is what a correct barrier test looks like: passes with the fix, fails without it. No deadlocks, no timeouts, clear pass/fail.

## Getting the barrier inside the function

There's a practical problem. Barriers are test infrastructure — they shouldn't exist in production code. In the earlier examples, the barrier was baked into the function body. That works for a demonstration, but you need a way to inject the barrier only when testing.

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

Production code calls `credit(1, 50)`. No hooks, no barrier, no overhead.

This is the pattern used in [Touch](https://github.com/starmode-base/touch), a WebAuthn-based encryption tool with real barrier-based concurrency tests. Here's the actual function that deletes passkeys while enforcing a business rule — users must always keep at least one:

```typescript
export function deletePasskey(
  ids: string[],
  viewerId: string,
  hooks?: { onTxBegin?: () => Promise<void> | void },
) {
  return db().transaction(async (tx) => {
    if (hooks?.onTxBegin) {
      await hooks.onTxBegin();
    }

    const rows = await tx
      .select({ id: schema.passkeys.id })
      .from(schema.passkeys)
      .where(eq(schema.passkeys.user_id, viewerId))
      .for("update");

    const rowsToDelete = rows.filter((row) => ids.includes(row.id));

    if (rows.length - rowsToDelete.length < 1) {
      throw new Error("Cannot delete the last passkey");
    }

    await tx
      .delete(schema.passkeys)
      .where(
        and(
          eq(schema.passkeys.user_id, viewerId),
          inArray(schema.passkeys.id, ids),
        ),
      );
  });
}
```

And the test that proves concurrent deletions can't violate the business rule:

```typescript
test("concurrent deletion of different passkeys leaves at least one", async () => {
  const user = await seedUser();
  const passkey1 = await seedPasskey(user.id);
  const passkey2 = await seedPasskey(user.id);

  const barrier = createBarrier(2);

  await Promise.allSettled([
    deletePasskey([passkey1.id], user.id, { onTxBegin: barrier }),
    deletePasskey([passkey2.id], user.id, { onTxBegin: barrier }),
  ]);

  const passkeys = await db()
    .select()
    .from(schema.passkeys)
    .where(eq(schema.passkeys.user_id, user.id));

  expect(passkeys.length).toBeGreaterThanOrEqual(1);
});
```

The barrier synchronizes the concurrent operations, `FOR UPDATE` serializes the reads, the test verifies the business rule holds. Remove the `.for("update")` and the test fails — both transactions see two passkeys, both allow the deletion, the user loses all their keys.

## The regression guard

Six months from now, someone refactors the data access layer. The query gets rewritten, the ORM changes, the function gets restructured. The `FOR UPDATE` gets lost in the shuffle. All other tests pass. The change ships. The race condition is back.

With the barrier test in your suite, that change doesn't ship. The test fails. The regression is caught before it leaves the developer's machine.

After writing a barrier test, remove the protection and verify the test fails. If the test passes with and without the fix, you have a vanity test — it proves nothing. The validation is simple: passes with the fix, fails without it.

---

Every race condition you've ever fixed is still one refactor away from coming back. Now your test suite catches it.
