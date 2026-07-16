import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

test("README documents Worker hosting and required DeepSeek secret", async () => {
  const readme = await readFile(new URL("../README.md", import.meta.url), "utf8");

  assert.match(readme, /Cloudflare Worker/);
  assert.match(readme, /DEEPSEEK_API_KEY/);
  assert.match(readme, /Supabase is not needed/);
  assert.match(readme, /Hanyu Pinyin/);
});

test("wrangler config points at a root Worker entry file for wrangler deploy", async () => {
  const config = await readFile(new URL("../wrangler.toml", import.meta.url), "utf8");

  assert.match(config, /main = "index\.js"/);
  assert.match(config, /compatibility_date/);
  assert.doesNotMatch(config, /pages_build_output_dir/);
});

test("GitHub deploy package includes the root Worker entry file", async () => {
  const worker = await readFile(new URL("../index.js", import.meta.url), "utf8");

  assert.match(worker, /export default/);
  assert.match(worker, /DEEPSEEK_API_KEY/);
  assert.match(worker, /api\.deepseek\.com\/chat\/completions/);
});

test("local server serves static files and the translate endpoint", async () => {
  const server = await readFile(new URL("../scripts/local-server.mjs", import.meta.url), "utf8");

  assert.match(server, /createServer/);
  assert.match(server, /\/api\/translate/);
  assert.match(server, /onRequestPost/);
  assert.match(server, /mockTranslation/);
});
