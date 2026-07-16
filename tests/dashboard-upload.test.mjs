import test from "node:test";
import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import { constants } from "node:fs";

test("deploy folder is shaped for Cloudflare dashboard drag-and-drop", async () => {
  await assertFile("deploy/index.html");
  await assertFile("deploy/app.js");
  await assertFile("deploy/styles.css");
  await assertFile("deploy/_worker.js");

  await assertMissing("deploy/wrangler.toml");
  await assertMissing("deploy/functions/api/translate.js");
});

test("dashboard worker serves assets and handles the translate API", async () => {
  const worker = await readFile(new URL("../deploy/_worker.js", import.meta.url), "utf8");

  assert.match(worker, /env\.ASSETS\.fetch/);
  assert.match(worker, /\/api\/translate/);
  assert.match(worker, /\/api\/ask/);
  assert.match(worker, /\/api\/usage/);
  assert.match(worker, /\/api\/usage\/nickname/);
  assert.match(worker, /\/api\/usage\/clear/);
  assert.match(worker, /\/admin\/usage/);
  assert.match(worker, /handleAsk/);
  assert.match(worker, /USAGE_KV/);
  assert.match(worker, /ADMIN_PIN/);
  assert.match(worker, /enforceApiRateLimit/);
  assert.match(worker, /DEFAULT_DAILY_DEVICE_LIMIT/);
  assert.match(worker, /x-content-type-options/);
  assert.match(worker, /content-security-policy/);
  assert.match(worker, /ADMIN_COOKIE_NAME/);
  assert.match(worker, /history\.replaceState/);
  assert.match(worker, /sessionStorage\.setItem\("et-admin-pin"/);
  assert.match(worker, /nickname:/);
  assert.match(worker, /prefix: "usage:"/);
  assert.match(worker, /Clear logs/);
  assert.match(worker, /attachLogNicknames/);
  assert.match(worker, /groupRecentLogs/);
  assert.match(worker, /device-log-group/);
  assert.match(worker, /<details class="device-log-group"/);
  assert.match(worker, /formatDeviceName\(log\.device, log\.deviceNickname\)/);
  assert.match(worker, /bilingual AI chat assistant/);
  assert.match(worker, /Talk directly with the user/);
  assert.match(worker, /If the user asks a normal question/);
  assert.match(worker, /Hanyu Pinyin with tone marks when the answer is Chinese/);
  assert.match(worker, /required: \["answer", "pinyin"\]/);
  assert.match(worker, /formatAskUserPrompt/);
  assert.match(worker, /DEEPSEEK_API_KEY/);
  assert.match(worker, /api\.deepseek\.com\/chat\/completions/);
  assert.match(worker, /GEMINI_API_KEY/);
  assert.match(worker, /generativelanguage\.googleapis\.com/);
  assert.match(worker, /x-goog-api-key/);
  assert.doesNotMatch(worker, /responseFormat/);
  assert.doesNotMatch(worker, /responseMimeType/);
  assert.doesNotMatch(worker, /responseSchema/);
  assert.doesNotMatch(worker, /mimeType/);
  assert.match(worker, /Hanyu Pinyin/);
  assert.match(worker, /对齐/);
});

async function assertFile(path) {
  await access(new URL(`../${path}`, import.meta.url), constants.R_OK);
}

async function assertMissing(path) {
  await assert.rejects(
    () => access(new URL(`../${path}`, import.meta.url), constants.R_OK),
    /ENOENT/
  );
}
