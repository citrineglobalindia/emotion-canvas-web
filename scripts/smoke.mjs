/**
 * Smoke test against a built site talking to the real Supabase project.
 *
 * Verifies the thing this change is about: content managed in the admin panel
 * actually reaches the public pages, and pages that have no managed content
 * still render their built-in design instead of going blank.
 *
 *   npm run build && npx vite preview --port 4173 &
 *   node scripts/smoke.mjs
 */
import { chromium } from "@playwright/test";

const BASE = process.env.SMOKE_BASE ?? "http://127.0.0.1:4173";

const results = [];
const check = (name, ok, detail = "") => {
  results.push({ name, ok, detail });
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}${detail ? ` — ${detail}` : ""}`);
};

const browser = await chromium.launch({
  executablePath: process.env.CHROMIUM_PATH ?? "/opt/pw-browsers/chromium",
});
const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
const page = await context.newPage();

// Sandboxed CI often blocks the browser's own egress while Node can still
// reach the internet. Forward Supabase calls through Node so the test exercises
// real data rather than silently passing on the fallback content.
await context.route("**://*.supabase.co/**", async (route) => {
  const request = route.request();
  try {
    const response = await fetch(request.url(), {
      method: request.method(),
      headers: request.headers(),
      body: ["GET", "HEAD"].includes(request.method()) ? undefined : request.postData(),
    });
    route.fulfill({
      status: response.status,
      headers: {
        "content-type": response.headers.get("content-type") ?? "application/json",
        "access-control-allow-origin": "*",
      },
      body: Buffer.from(await response.arrayBuffer()),
    });
  } catch (error) {
    route.abort();
    console.error("proxy error", request.url(), String(error));
  }
});

// Google Fonts is not reachable from CI either; serving nothing is fine.
await context.route("**://fonts.googleapis.com/**", (route) =>
  route.fulfill({ status: 200, contentType: "text/css", body: "" }),
);
await context.route("**://fonts.gstatic.com/**", (route) => route.abort());

const consoleErrors = [];
page.on("console", (m) => {
  if (m.type() === "error") consoleErrors.push(m.text());
});
page.on("pageerror", (e) => consoleErrors.push(String(e)));

const visit = async (path) => {
  await page.goto(`${BASE}${path}`, { waitUntil: "networkidle" });
  // The intro loader covers the first paint; give it a beat to clear.
  await page.waitForTimeout(1500);
};

// --- Home -------------------------------------------------------------------
await visit("/");
check("home renders hero words", (await page.locator("h1").count()) >= 3);
check(
  "home shows testimonials heading",
  await page.getByText("Our Client's Say").first().isVisible(),
);

const instaTiles = await page.locator('a[href*="instagram.com"] img').count();
check("home shows instagram tiles from admin", instaTiles >= 6, `${instaTiles} tiles`);

// --- Stories: the point of the whole change ---------------------------------
await visit("/stories");
const storyHeadings = await page.locator("main h2").allTextContents();
check(
  "stories page lists the couple published in admin",
  storyHeadings.some((t) => t.includes("Sindhu")),
  storyHeadings.join(" | ") || "(none)",
);
check(
  "demo stories no longer shown once real stories exist",
  !storyHeadings.some((t) => t.includes("Priya & Arjun")),
  storyHeadings.join(" | "),
);

// --- Story detail -----------------------------------------------------------
await visit("/stories/wedding-of-sindhu-harsha");
const detailTitle = (await page.locator("h1").first().textContent()) ?? "";
check("story detail renders the admin's story", detailTitle.includes("Sindhu"), detailTitle);
check(
  "story detail does not 404",
  !(await page.getByText("404", { exact: false }).first().isVisible().catch(() => false)),
);

// --- Pages with no managed content keep their design ------------------------
for (const [path, expectation] of [
  ["/gallery", "Gallery"],
  ["/films", "Films"],
  ["/about", "The Studio"],
  ["/contact", "Get in Touch"],
  ["/blog", "Journal"],
]) {
  await visit(path);
  const body = (await page.locator("body").textContent()) ?? "";
  const imgs = await page.locator("img").count();
  check(
    `${path} still renders its design (fallback)`,
    body.includes(expectation) && imgs > 0,
    `${imgs} images`,
  );
}

// --- Admin is reachable and gated -------------------------------------------
await visit("/admin");
check(
  "admin redirects anonymous visitors to login",
  page.url().includes("/admin/login"),
  page.url(),
);

const realErrors = consoleErrors.filter(
  (e) => !/favicon|Failed to load resource.*404.*favicon/i.test(e),
);
check("no console errors across the site", realErrors.length === 0, realErrors.slice(0, 3).join(" / "));

await browser.close();

const failed = results.filter((r) => !r.ok);
console.log(`\n${results.length - failed.length}/${results.length} checks passed`);
process.exit(failed.length ? 1 : 0);
