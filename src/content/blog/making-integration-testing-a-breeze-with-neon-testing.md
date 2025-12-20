# Making integration testing a breeze with Neon Testing

Your tests pass, but your production deploy fails because of a unique constraint violation. Sound familiar? The problem isn't your code—it's that you're testing mocks instead of real database behavior, or your test database has drifted from production. Either way, your tests aren't reflecting what will actually happen when your code hits production.

To be confident our code behaves as expected, our tests need to run against a real database that's in sync with production. But that's easier said than done—spinning up containers, managing schema migrations, coordinating between dev environments, CI/CD pipelines, and production. Many teams either skip it entirely or settle for inadequate mocks.

That's where [Neon branching](https://neon.tech/docs/introduction/branching) and [Neon Testing](https://www.npmjs.com/package/neon-testing) change everything. Neon gives you instant, isolated copies of your production database without infrastructure headache. Neon Testing turns those branches into disposable test environments, so your tests run against the same database constraints and behaviors as production.

The result? Reliable integration tests that are finally as easy as unit tests, and the confidence to release more often—even on Fridays!

## Why I built Neon Testing

I'm [Mikael Lirbank](https://www.lirbank.com/). I build robust, reliable, high-quality AI systems. Neon Testing started as a way to make my own integration testing easier, and it worked so well that I open-sourced it.

## Getting started

Let's start with a simple example. Here's a basic user creation function that relies on a unique index to prevent multiple users with the same email address.

```ts
// db/users.ts
import { Pool } from "@neondatabase/serverless";

const pool = new Pool({ connectionString: process.env.DATABASE_URL! });

export async function createUser(email: string) {
  return pool.query("INSERT INTO users (email) VALUES ($1)", [email]);
}
```

If your `users` table has a unique constraint on email, calling this function twice with the same email should fail the second time. That's exactly the kind of behavior you can't mock, and a stale test database without the unique constraint would give you a false positive.

Let's test this!

### Step 1: Set up

Install the packages.

```sh
bun add @neondatabase/serverless
bun add -D neon-testing vitest
```

Configure Vitest to ensure tests use isolated databases. This plugin clears any existing `DATABASE_URL` environment variable, preventing tests from accidentally using your local or production database instead of the isolated test branches.

```ts
// vitest.config.ts
import { defineConfig } from "vitest/config";
import { neonTesting } from "neon-testing/vite";

export default defineConfig({
  plugins: [neonTesting()],
});
```

Create a small setup module that you'll reuse across all your test files.

```ts
// test-setup.ts
import { makeNeonTesting } from "neon-testing";

// Configure once (see npm docs for options)
export const withNeonTestBranch = makeNeonTesting({
  apiKey: process.env.NEON_API_KEY!,
  projectId: process.env.NEON_PROJECT_ID!,
  // Recommended for Neon WebSocket drivers to automatically close connections:
  autoCloseWebSockets: true,
});
```

### Step 2: Write tests that verify real database behavior

Now you can test the actual constraint behavior against your real production schema (with or without production data, or even with anonymized production data). Each test file automatically gets its own fresh database clone on each run, so tests are completely isolated.

```ts
// db/users.test.ts
import { test, expect } from "vitest";
import { withNeonTestBranch } from "../test-setup";
import { createUser } from "./users";

// Enable Neon Testing for this file
withNeonTestBranch();

test("unique email constraint", async () => {
  await createUser("test@example.com");
  await expect(createUser("test@example.com")).rejects.toThrow();
});
```

### Step 3: Run your tests

Start [Vitest](https://vitest.dev/) in watch mode and see your tests run as you edit.

```sh
bunx vitest
```

That's it! Your tests now run against the same database constraints and behaviors as production.

## Wrapping up

Integration testing usually fails teams, not because the tests are hard to write, but because the infrastructure is hard to stand up and maintain. With Neon's branching infrastructure and the Neon Testing library, that pain is gone. Now you can have reliable integration testing across your entire development lifecycle—local development, preview, staging, CI/CD, and production.

Neon Testing solves real testing challenges, helping teams ship with confidence. If integration testing has been slowing you down, give Neon Testing a try and see how much simpler it can be.

You can find it on [npm](https://www.npmjs.com/package/neon-testing) and [GitHub](https://github.com/starmode-base/neon-testing).
