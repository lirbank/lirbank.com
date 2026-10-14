#!/usr/bin/env bun

/**
 * Site contract check
 *
 * Fetches the deployed site and verifies what the deployment promises:
 * - HTTP and the apex domain redirect to https://www.lirbank.com, path intact
 * - robots.txt, the sitemap, and llms.txt exist and agree with the articles
 * - Every page in the sitemap declares itself canonical
 * - Every article page answers at its URL, and the trailing slash variant
 *   redirects to it
 * - Every article has a markdown version that carries a canonical header
 *   pointing back at the page, a markdown link from the page, and an OG image
 *   that the page declares
 *
 * Prints one line per check. A failure gets one short reason, and a problem
 * shared by every page reads "missing on all 6" instead of six lines.
 *
 * Run: bun run site:check [base-url]
 *
 * The base URL defaults to production. Pass a local wrangler URL to check a
 * build before deploying. Redirects are zone configuration, so they're only
 * checked against production.
 */

import { readdirSync } from "node:fs";

const SITE = "https://www.lirbank.com";
const base = (process.argv[2] ?? SITE).replace(/\/$/, "");

const GREEN = "\x1b[32m";
const RED = "\x1b[31m";
const DIM = "\x1b[2m";
const RESET = "\x1b[0m";

const CANONICAL = /<link rel="canonical" href="([^"]+)">/;
const ALTERNATE = /<link rel="alternate" type="text\/markdown" href="([^"]+)">/;
const OG_IMAGE = /<meta property="og:image" content="([^"]+)">/;
const CANONICAL_HEADER = /<([^>]+)>;\s*rel="canonical"/;

const slugs = readdirSync(new URL("../src/content/articles", import.meta.url))
  .filter((file) => file.endsWith(".md"))
  .map((file) => file.slice(0, -".md".length))
  .sort();

interface Fetched {
  status: number;
  type: string;
  location: string | null;
  link: string | null;
  body: string;
  error: string | null;
}

/** One line of output, with a short reason when the check failed */
interface Check {
  name: string;
  reason: string | null;
}

/** Fetches without following redirects, giving up after ten seconds */
async function get(url: string): Promise<Fetched> {
  try {
    const res = await fetch(url, {
      redirect: "manual",
      signal: AbortSignal.timeout(10_000),
    });
    return {
      status: res.status,
      type: res.headers.get("content-type") ?? "",
      location: res.headers.get("location"),
      link: res.headers.get("link"),
      body: await res.text(),
      error: null,
    };
  } catch (error) {
    const timedOut = error instanceof Error && error.name === "TimeoutError";
    return {
      status: 0,
      type: "",
      location: null,
      link: null,
      body: "",
      error: timedOut ? "timed out" : "unreachable",
    };
  }
}

/** Why a response isn't a 200 of the given content type, or null if it is */
function badResponse(res: Fetched, type = ""): string | null {
  if (res.error) return res.error;
  if (res.status !== 200) return String(res.status);
  if (!res.type.startsWith(type)) return `served as ${res.type || "nothing"}`;
  return null;
}

/** Why a declared URL isn't the expected one, or null if it is */
function badValue(got: string | undefined, expected: string): string | null {
  if (got === undefined) return "missing";
  return got === expected ? null : `points at ${got}`;
}

/** Why a response isn't a redirect to the given URL, or null if it is */
function badRedirect(res: Fetched, from: string, to: string): string | null {
  if (res.error) return res.error;
  if (res.status < 300 || res.status > 399 || !res.location) {
    return `${res.status} instead of a redirect`;
  }
  return badValue(new URL(res.location, from).href, to);
}

/** The first problem found, so one root cause doesn't read as several */
function first(...reasons: (string | null)[]): string | null {
  return reasons.find((reason) => reason !== null) ?? null;
}

/**
 * Runs one check across many URLs and folds the problems into one reason,
 * "missing on all 4" when every URL fails the same way, otherwise each
 * problem with the paths it affects
 */
function across<T>(
  items: T[],
  path: (item: T) => string,
  problem: (item: T) => string | null,
): string | null {
  const found = items.flatMap((item) => {
    const kind = problem(item);
    return kind === null ? [] : [{ kind, path: path(item) }];
  });
  if (found.length === 0) return null;

  const kinds = [...new Set(found.map(({ kind }) => kind))];
  if (found.length === items.length && kinds.length === 1 && items.length > 1) {
    return `${kinds[0]} on all ${items.length}`;
  }
  return kinds
    .map((kind) => {
      const paths = found.filter((f) => f.kind === kind).map((f) => f.path);
      return `${kind} on ${paths.join(", ")}`;
    })
    .join(" · ");
}

/** Expects a single 301 straight to the target, which then answers 200 */
async function checkRedirect(from: string, to: string): Promise<Check> {
  const hops: { url: string; status: string }[] = [];
  let url: string | null = from;
  // Stops after five hops, so a redirect loop shows up as a failure
  while (url && hops.length < 5) {
    const res = await get(url);
    hops.push({ url, status: res.error ?? String(res.status) });
    url = res.location ? new URL(res.location, url).href : null;
  }

  const [start, end] = hops;
  const ok =
    hops.length === 2 &&
    start?.status === "301" &&
    end?.url === to &&
    end.status === "200";
  // On failure, show where the chain actually went
  const chain = [
    start?.status,
    ...hops.slice(1).map((hop) => `${hop.url} (${hop.status})`),
  ].join(" → ");
  return { name: from, reason: ok ? null : chain };
}

async function checkRedirects(): Promise<Check[]> {
  const article = `/${slugs[0]!}`;
  return Promise.all([
    checkRedirect("http://lirbank.com/", `${SITE}/`),
    checkRedirect("http://www.lirbank.com/", `${SITE}/`),
    checkRedirect("https://lirbank.com/", `${SITE}/`),

    checkRedirect(`http://lirbank.com${article}`, `${SITE}${article}`),
    checkRedirect(`http://www.lirbank.com${article}`, `${SITE}${article}`),
    checkRedirect(`https://lirbank.com${article}`, `${SITE}${article}`),
  ]);
}

async function checkRobots(): Promise<Check> {
  const res = await get(`${base}/robots.txt`);
  const line = `Sitemap: ${SITE}/sitemap-index.xml`;
  return {
    name: "robots.txt",
    reason: first(
      badResponse(res, "text/plain"),
      res.body.includes(line) ? null : "no sitemap line",
    ),
  };
}

/** Also returns the listed page URLs, which drive the canonical tag check */
async function checkSitemap(): Promise<{ check: Check; pages: string[] }> {
  const index = await get(`${base}/sitemap-index.xml`);
  const sitemap = await get(`${base}/sitemap-0.xml`);
  const pages = [...sitemap.body.matchAll(/<loc>([^<]+)<\/loc>/g)].map(
    (match) => match[1]!,
  );
  const markdown = pages.filter((page) => page.endsWith(".md"));
  const indexBad = badResponse(index);
  const sitemapBad = badResponse(sitemap);

  const reason = first(
    indexBad && `sitemap-index.xml ${indexBad}`,
    index.body.includes(`<loc>${SITE}/sitemap-0.xml</loc>`)
      ? null
      : "index doesn't list sitemap-0.xml",
    sitemapBad && `sitemap-0.xml ${sitemapBad}`,
    across(
      slugs,
      (slug) => `/${slug}`,
      (slug) => (pages.includes(`${SITE}/${slug}`) ? null : "missing"),
    ),
    markdown.length === 0
      ? null
      : `lists ${markdown.map((url) => url.slice(SITE.length)).join(", ")}`,
  );
  return { check: { name: "sitemap", reason }, pages };
}

async function checkLlms(): Promise<Check> {
  const res = await get(`${base}/llms.txt`);
  return {
    name: "llms.txt",
    reason: first(
      badResponse(res, "text/plain"),
      across(
        slugs,
        (slug) => `/${slug}.md`,
        (slug) => (res.body.includes(`${SITE}/${slug}.md`) ? null : "missing"),
      ),
    ),
  };
}

async function checkCanonicalTags(pages: string[]): Promise<Check> {
  const name = "canonical tag";
  if (pages.length === 0) return { name, reason: "no pages in the sitemap" };

  const fetched = await Promise.all(
    pages.map(async (url) => {
      const path = url.slice(SITE.length) || "/";
      return { url, path, res: await get(`${base}${path}`) };
    }),
  );
  return {
    name,
    reason: across(
      fetched,
      ({ path }) => path,
      ({ url, res }) =>
        first(
          badResponse(res, "text/html"),
          badValue(res.body.match(CANONICAL)?.[1], url),
        ),
    ),
  };
}

async function checkArticles(): Promise<Check[]> {
  const articles = await Promise.all(
    slugs.map(async (slug) => ({
      slug,
      html: await get(`${base}/${slug}`),
      slash: await get(`${base}/${slug}/`),
      md: await get(`${base}/${slug}.md`),
      og: await get(`${base}/og/${slug}.png`),
    })),
  );

  return [
    {
      name: "page",
      reason: across(
        articles,
        ({ slug }) => `/${slug}`,
        ({ html }) => badResponse(html, "text/html"),
      ),
    },
    {
      name: "trailing slash",
      reason: across(
        articles,
        ({ slug }) => `/${slug}/`,
        ({ slug, slash }) =>
          badRedirect(slash, `${base}/${slug}/`, `${base}/${slug}`),
      ),
    },
    {
      name: "markdown file",
      reason: across(
        articles,
        ({ slug }) => `/${slug}.md`,
        ({ md }) => badResponse(md, "text/markdown"),
      ),
    },
    {
      name: "markdown link",
      reason: across(
        articles,
        ({ slug }) => `/${slug}`,
        // A missing page is already reported on the page line
        ({ slug, html }) =>
          badResponse(html, "text/html")
            ? "no page"
            : badValue(html.body.match(ALTERNATE)?.[1], `${SITE}/${slug}.md`),
      ),
    },
    {
      name: "canonical header",
      reason: across(
        articles,
        ({ slug }) => `/${slug}.md`,
        // A missing file is already reported on the markdown file line
        ({ slug, md }) =>
          badResponse(md, "text/markdown")
            ? "no markdown file"
            : badValue(
                md.link?.match(CANONICAL_HEADER)?.[1],
                `${SITE}/${slug}`,
              ),
      ),
    },
    {
      name: "og image",
      reason: across(
        articles,
        ({ slug }) => `/og/${slug}.png`,
        ({ og }) => badResponse(og, "image/png"),
      ),
    },
    {
      name: "og tag",
      reason: across(
        articles,
        ({ slug }) => `/${slug}`,
        ({ slug, html }) =>
          badResponse(html, "text/html")
            ? "no page"
            : badValue(
                html.body.match(OG_IMAGE)?.[1],
                `${SITE}/og/${slug}.png`,
              ),
      ),
    },
  ];
}

interface Group {
  title: string;
  checks: Check[];
}

function printGroup({ title, checks }: Group) {
  console.log(`\n${DIM}${title}${RESET}`);
  for (const { name, reason } of checks) {
    // 16 fits "canonical header". Longer names, the redirect URLs, just get
    // the three spaces.
    console.log(
      reason === null
        ? `  ${GREEN}✓${RESET}  ${name}`
        : `  ${RED}✗${RESET}  ${name.padEnd(16)}   ${RED}${reason}${RESET}`,
    );
  }
}

const isProduction = base === SITE;
const { check: sitemap, pages } = await checkSitemap();
const groups: Group[] = [
  ...(isProduction
    ? [{ title: "Redirects", checks: await checkRedirects() }]
    : []),
  { title: "Files", checks: [await checkRobots(), sitemap, await checkLlms()] },
  { title: "Pages", checks: [await checkCanonicalTags(pages)] },
  { title: "Articles", checks: await checkArticles() },
];

console.log(`\n${DIM}${base}${RESET}`);
if (!isProduction) {
  console.log(`${DIM}Redirects skipped, they only exist in production${RESET}`);
}
for (const group of groups) printGroup(group);

const checks = groups.flatMap((group) => group.checks);
const failed = checks.filter((check) => check.reason !== null).length;
const passed = checks.length - failed;

if (failed === 0) {
  console.log(`\n${GREEN}✓ All ${passed} checks passed${RESET}\n`);
} else {
  console.log(`\n${RED}✗ ${failed} failed${RESET}, ${passed} passed\n`);
  process.exit(1);
}
