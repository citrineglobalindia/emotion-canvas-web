// Uploads every image in src/assets/ to the Supabase media-library bucket
// and registers it in the media_assets table, so the existing mock photos
// show up in the admin Media Library.
//
// Usage:
//   node scripts/sync-mock-media.mjs <admin-email> <admin-password>
//
// Idempotent: skips files already registered (by file_path).

import { createClient } from "@supabase/supabase-js";
import { readFile, readdir, stat } from "node:fs/promises";
import { resolve, join, extname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const ROOT = resolve(__dirname, "..");
const ASSETS_DIR = resolve(ROOT, "src/assets");
const BUCKET = "media-library";
const FOLDER = "mock";

const MIME = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".gif": "image/gif",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
};

async function loadEnv() {
  const raw = await readFile(resolve(ROOT, ".env"), "utf-8");
  const env = {};
  for (const line of raw.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    env[key] = value;
  }
  return env;
}

const email = process.argv[2] || process.env.ADMIN_EMAIL;
const password = process.argv[3] || process.env.ADMIN_PASSWORD;
if (!email || !password) {
  console.error("Usage: node scripts/sync-mock-media.mjs <admin-email> <admin-password>");
  process.exit(1);
}

const env = await loadEnv();
const url = env.VITE_SUPABASE_URL;
const key = env.VITE_SUPABASE_PUBLISHABLE_KEY;
if (!url || !key) {
  console.error("VITE_SUPABASE_URL / VITE_SUPABASE_PUBLISHABLE_KEY missing from .env");
  process.exit(1);
}

const supabase = createClient(url, key, { auth: { persistSession: false } });

const { data: auth, error: authErr } = await supabase.auth.signInWithPassword({ email, password });
if (authErr || !auth?.session) {
  console.error("Sign in failed:", authErr?.message ?? "no session");
  process.exit(1);
}
console.log(`Signed in as ${auth.user.email}`);

const allFiles = await readdir(ASSETS_DIR);
const files = allFiles.filter((f) => MIME[extname(f).toLowerCase()]);
console.log(`Found ${files.length} image files in src/assets/`);

let uploaded = 0;
let skipped = 0;
let failed = 0;
const urls = [];

for (const file of files) {
  const localPath = join(ASSETS_DIR, file);
  const remotePath = `${FOLDER}/${file}`;
  const ext = extname(file).toLowerCase();
  const mime = MIME[ext];
  const stats = await stat(localPath);
  const buf = await readFile(localPath);

  const { data: existing, error: selErr } = await supabase
    .from("media_assets")
    .select("id, file_path")
    .eq("file_path", remotePath)
    .maybeSingle();
  if (selErr) {
    console.error(`  [FAIL] ${file}: media_assets check: ${selErr.message}`);
    failed++;
    continue;
  }
  if (existing) {
    const { data: pub } = supabase.storage.from(BUCKET).getPublicUrl(remotePath);
    urls.push(pub.publicUrl);
    console.log(`  [SKIP] ${file} (already registered)`);
    skipped++;
    continue;
  }

  const { error: upErr } = await supabase.storage.from(BUCKET).upload(remotePath, buf, {
    contentType: mime,
    upsert: true,
  });
  if (upErr) {
    console.error(`  [FAIL] ${file}: storage upload: ${upErr.message}`);
    failed++;
    continue;
  }

  const altText = file.replace(/\.[^.]+$/, "").replace(/[-_]/g, " ");
  const { error: insErr } = await supabase.from("media_assets").insert({
    bucket_id: BUCKET,
    file_name: file,
    file_path: remotePath,
    mime_type: mime,
    file_size: stats.size,
    alt_text: altText,
    tags: ["mock"],
    uploaded_by: auth.user.id,
    is_public: true,
  });
  if (insErr) {
    console.error(`  [FAIL] ${file}: media_assets insert: ${insErr.message}`);
    failed++;
    continue;
  }

  const { data: pub } = supabase.storage.from(BUCKET).getPublicUrl(remotePath);
  urls.push(pub.publicUrl);
  console.log(`  [OK]   ${file}  (${(stats.size / 1024).toFixed(1)} KB)`);
  uploaded++;
}

console.log("");
console.log(`Done: ${uploaded} uploaded, ${skipped} skipped, ${failed} failed`);
if (urls.length) {
  console.log("");
  console.log("First public URL (sanity check):");
  console.log(urls[0]);
}

await supabase.auth.signOut();
process.exit(failed > 0 ? 1 : 0);
