import { describe, test, expect } from "bun:test";
import { validateResult } from "./check";

describe("validateResult", () => {
  test("passes when all fields match", () => {
    const result = validateResult(
      { status: 200, server: "Netlify" },
      { status: 200, location: null, server: "Netlify" },
    );

    expect(result.pass).toBe(true);
    expect(result.failures).toEqual([]);
  });

  test("fails on wrong status", () => {
    const result = validateResult(
      { status: 200 },
      { status: 301, location: null, server: "Netlify" },
    );

    expect(result.failures).toContain("status: got 301, expected 200");
  });

  test("fails on wrong server (not status)", () => {
    const result = validateResult(
      { status: 200, server: "Netlify" },
      { status: 200, location: null, server: "Cloudflare" },
    );

    expect(result.pass).toBe(false);
    expect(result.failures).toContain(
      "server: got Cloudflare, expected Netlify",
    );
    expect(result.failures.some((f) => f.startsWith("status:"))).toBe(false);
  });

  test("fails on wrong location", () => {
    const result = validateResult(
      { status: 301, location: "https://example.com/" },
      { status: 301, location: "https://wrong.com/", server: "Netlify" },
    );

    expect(result.failures).toContain(
      "location: got https://wrong.com/, expected https://example.com/",
    );
  });
});
