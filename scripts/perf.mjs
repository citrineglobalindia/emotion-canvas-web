/**
 * Scroll performance probe for the home page.
 *
 * Scripts a scroll through the lower half of the page — the testimonials
 * marquee, the "Follow Along" Instagram strip and the contact section — and
 * reports how much the main thread was blocked and how many frames were
 * dropped. Run it before and after a change to see whether scrolling actually
 * got smoother rather than guessing.
 *
 *   npm run build && npx vite preview --port 4173 &
 *   node scripts/perf.mjs
 */
import { chromium } from "@playwright/test";

// Optional: only needed for PERF_SIMULATE_OPTIMISED, so the script still runs
// on a checkout that has not installed it.
let sharp = null;
if (process.env.PERF_SIMULATE_OPTIMISED === "1") {
  try {
    ({ default: sharp } = await import("sharp"));
  } catch {
    console.error("PERF_SIMULATE_OPTIMISED needs `npm i -D sharp`; continuing without it.");
  }
}

const BASE = process.env.PERF_BASE ?? "http://127.0.0.1:4173";
const LABEL = process.argv[2] ?? "run";

const browser = await chromium.launch({
  executablePath: process.env.CHROMIUM_PATH ?? "/opt/pw-browsers/chromium",
});
const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });

// CI sandboxes block the browser's egress while Node can still reach the
// network, so forward the app's own requests through Node.
let bytes = 0;
const proxyErrors = [];
let requests = 0;
await context.route("**://*.supabase.co/**", async (route) => {
  requests++;
  try {
    const res = await fetch(route.request().url(), { headers: route.request().headers() });
    let buf = Buffer.from(await res.arrayBuffer());

    // `PERF_SIMULATE_OPTIMISED=1` shrinks any oversized original on the way
    // through, to model what the page will look like once the media library
    // has been optimised in the admin.
    if (
      sharp &&
      (res.headers.get("content-type") ?? "").startsWith("image/") &&
      buf.length > 2 * 1024 * 1024
    ) {
      buf = await sharp(buf).resize({ width: 2560, withoutEnlargement: true })
        .jpeg({ quality: 82 }).toBuffer();
    }
    bytes += buf.length;
    route.fulfill({
      status: res.status,
      headers: {
        "content-type": res.headers.get("content-type") ?? "application/octet-stream",
        "access-control-allow-origin": "*",
      },
      body: buf,
    });
  } catch (error) {
    // Never fail silently: an aborted request would load no image at all and
    // make the page look deceptively fast.
    proxyErrors.push(`${route.request().url().slice(0, 80)} — ${String(error).slice(0, 80)}`);
    route.abort();
  }
});
await context.route("**://fonts.googleapis.com/**", (r) =>
  r.fulfill({ status: 200, contentType: "text/css", body: "" }),
);
await context.route("**://fonts.gstatic.com/**", (r) => r.abort());

const page = await context.newPage();

// Throttle the CPU so results resemble a mid-range laptop or phone rather than
// a fast CI machine, where almost anything looks smooth.
const client = await context.newCDPSession(page);
const THROTTLE = Number(process.env.PERF_THROTTLE ?? 4);
await client.send("Emulation.setCPUThrottlingRate", { rate: THROTTLE });

await page.goto(BASE, { waitUntil: "load" });
await page.waitForTimeout(3000); // let the intro loader clear

await page.evaluate(() => {
  window.__perf = { longTasks: [], frames: [] };
  new PerformanceObserver((list) => {
    for (const e of list.getEntries()) window.__perf.longTasks.push(e.duration);
  }).observe({ entryTypes: ["longtask"] });

  let last = performance.now();
  const tick = (now) => {
    window.__perf.frames.push(now - last);
    last = now;
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
});

// Scroll through the lower page in realistic wheel-sized steps.
const height = await page.evaluate(() => document.body.scrollHeight);
const start = Math.floor(height * 0.45);
for (let y = start; y < height; y += 400) {
  await page.mouse.wheel(0, 400);
  await page.waitForTimeout(120);
}
// Let lazy images finish arriving and decoding, otherwise a slow image that
// never loaded would flatter the numbers.
await page.waitForLoadState("networkidle", { timeout: 60000 }).catch(() => {});
await page.waitForTimeout(2500);

const perf = await page.evaluate((throttle) => {
  // A "janky" frame is one that overran the frame budget. Under CPU throttling
  // the budget stretches by the same factor, otherwise every frame looks bad
  // regardless of what the page is doing.
  const budget = 16.7 * throttle;
  const f = window.__perf.frames.filter((d) => d > 0);
  const lt = window.__perf.longTasks;
  const sorted = [...f].sort((a, b) => a - b);
  return {
    longTaskCount: lt.length,
    // Total Blocking Time: main-thread time beyond the 50ms budget.
    totalBlockingMs: Math.round(lt.reduce((s, d) => s + Math.max(0, d - 50), 0)),
    worstTaskMs: Math.round(Math.max(0, ...lt)),
    frames: f.length,
    // A frame over ~32ms is a visible stutter at 60fps.
    jankyFrames: f.filter((d) => d > budget).length,
    worstFrameMs: Math.round(Math.max(...f)),
    p95FrameMs: Math.round(sorted[Math.floor(sorted.length * 0.95)] ?? 0),
    medianFrameMs: Math.round(sorted[Math.floor(sorted.length * 0.5)] ?? 0),
    budgetMs: Math.round(budget),
  };
}, THROTTLE);

console.log(`\n=== ${LABEL} (${THROTTLE}x CPU throttle, frame budget ${Math.round(16.7 * THROTTLE)}ms) ===`);
console.log(`  backend requests           : ${requests} (${proxyErrors.length} failed)`);
console.log(`  image/network bytes pulled : ${(bytes / 1048576).toFixed(1)} MB`);
proxyErrors.slice(0, 3).forEach((e) => console.log(`    ! ${e}`));
console.log(`  long tasks                 : ${perf.longTaskCount}`);
console.log(`  total blocking time        : ${perf.totalBlockingMs} ms`);
console.log(`  worst single task          : ${perf.worstTaskMs} ms`);
console.log(`  frames over budget         : ${perf.jankyFrames} / ${perf.frames}`);
console.log(`  median frame time          : ${perf.medianFrameMs} ms  (=${(perf.medianFrameMs / THROTTLE).toFixed(1)}ms unthrottled)`);
console.log(`  p95 frame time             : ${perf.p95FrameMs} ms  (=${(perf.p95FrameMs / THROTTLE).toFixed(1)}ms unthrottled)`);
console.log(`  worst frame                : ${perf.worstFrameMs} ms`);

await browser.close();
