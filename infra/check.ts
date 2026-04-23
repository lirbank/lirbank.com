#!/usr/bin/env bun

/**
 * Infrastructure health check
 *
 * Validates that production infrastructure is configured correctly:
 * - Domain status codes match expected values
 * - Redirects point to correct locations
 * - Server headers are correct
 *
 * Run: bun run infra:check
 */

import { resolveNs } from "node:dns/promises";
import config from "./config.json";

const GREEN = "\x1b[32m";
const RED = "\x1b[31m";
const DIM = "\x1b[2m";
const RESET = "\x1b[0m";

interface Expected {
  status: number;
  location?: string;
  server?: string;
}

interface Actual {
  status: number;
  location: string | null;
  server: string | null;
}

interface CheckResult {
  url: string;
  expected: Expected;
  actual: Actual;
  pass: boolean;
  failures: string[];
  nameservers: string;
}

export function validateResult(
  expected: Expected,
  actual: Actual,
): { pass: boolean; failures: string[] } {
  const failures: string[] = [];

  if (actual.status !== expected.status) {
    failures.push(`status: got ${actual.status}, expected ${expected.status}`);
  }

  if (expected.location && actual.location !== expected.location) {
    failures.push(
      `location: got ${actual.location}, expected ${expected.location}`,
    );
  }

  if (expected.server && actual.server !== expected.server) {
    failures.push(`server: got ${actual.server}, expected ${expected.server}`);
  }

  return { pass: failures.length === 0, failures };
}

async function checkUrl(
  url: string,
  expected: Expected,
  nameservers: string,
): Promise<CheckResult> {
  try {
    const res = await fetch(url, { method: "GET", redirect: "manual" });
    const actual: Actual = {
      status: res.status,
      location: res.headers.get("location"),
      server: res.headers.get("server"),
    };

    const { pass, failures } = validateResult(expected, actual);

    return { url, expected, actual, pass, failures, nameservers };
  } catch (error) {
    const code =
      error instanceof Error && "code" in error
        ? (error as Error & { code: string }).code
        : "UNKNOWN";

    return {
      url,
      expected,
      actual: { status: 0, location: null, server: null },
      pass: false,
      failures: [`fetch failed: ${code}`],
      nameservers,
    };
  }
}

function getApexDomain(url: string): string {
  const { hostname } = new URL(url);
  const parts = hostname.split(".");
  return parts.slice(-2).join(".");
}

async function resolveNameservers(domain: string): Promise<string> {
  try {
    const nameservers = await resolveNs(domain);
    return nameservers.sort().join(", ");
  } catch (error) {
    const code =
      error instanceof Error && "code" in error
        ? (error as Error & { code: string }).code
        : "UNKNOWN";
    return `NS lookup failed: ${code}`;
  }
}

function printTable(results: CheckResult[]) {
  const cols = {
    url: Math.max(3, ...results.map((r) => r.url.length)),
    status: Math.max(6, ...results.map((r) => String(r.actual.status).length)),
    location: Math.max(
      8,
      ...results.map((r) => (r.actual.location ?? "—").length),
    ),
    server: Math.max(6, ...results.map((r) => (r.actual.server ?? "—").length)),
    nameservers: Math.max(12, ...results.map((r) => r.nameservers.length)),
  };

  const totalWidth =
    cols.url +
    cols.status +
    cols.location +
    cols.server +
    cols.nameservers +
    14;

  console.log(
    `${"   URL".padEnd(cols.url + 3)}  ${"Status".padEnd(cols.status)}  ${"Location".padEnd(cols.location)}  ${"Server".padEnd(cols.server)}  Name servers`,
  );
  console.log(`${DIM}${"─".repeat(totalWidth)}${RESET}`);

  for (const result of results) {
    const icon = result.pass ? `${GREEN}✓${RESET}` : `${RED}✗${RESET}`;
    const status = String(result.actual.status);
    const location = result.actual.location ?? "—";
    const server = result.actual.server ?? "—";

    console.log(
      `${icon}  ${result.url.padEnd(cols.url)}  ${status.padEnd(cols.status)}  ${location.padEnd(cols.location)}  ${server.padEnd(cols.server)}  ${result.nameservers}`,
    );

    for (const failure of result.failures) {
      console.log(`   ${RED}└ ${failure}${RESET}`);
    }
  }

  console.log(`${DIM}${"─".repeat(totalWidth)}${RESET}`);
}

async function checkDomains(): Promise<CheckResult[]> {
  if (!config.domains?.length) return [];

  const nsCache = new Map<string, Promise<string>>();
  const results: CheckResult[] = [];

  for (const check of config.domains) {
    const apex = getApexDomain(check.url);
    let nsPromise = nsCache.get(apex);
    if (!nsPromise) {
      nsPromise = resolveNameservers(apex);
      nsCache.set(apex, nsPromise);
    }
    const nameservers = await nsPromise;

    const result = await checkUrl(
      check.url,
      {
        status: check.status,
        location: check.location,
        server: check.server,
      },
      nameservers,
    );
    results.push(result);
  }

  return results;
}

// Only run when executed directly (not when imported for tests)
if (import.meta.main) {
  const results: CheckResult[] = [];

  results.push(...(await checkDomains()));

  console.log(`\n${DIM}Domains${RESET}\n`);
  printTable(results);

  const passed = results.filter((r) => r.pass).length;
  const failed = results.filter((r) => !r.pass).length;

  if (failed === 0) {
    console.log(`\n${GREEN}✓ All ${passed} checks passed${RESET}\n`);
  } else {
    console.log(
      `\n${RED}✗ ${failed} check(s) failed${RESET}, ${passed} passed\n`,
    );
    process.exit(1);
  }
}
