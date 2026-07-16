import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

test("single-file worker exists for Cloudflare dashboard editor deployment", async () => {
  const worker = await readFile(new URL("../deploy-worker.js", import.meta.url), "utf8");

  assert.match(worker, /export default/);
  assert.match(worker, /\/api\/translate/);
  assert.match(worker, /DEEPSEEK_API_KEY/);
  assert.match(worker, /api\.deepseek\.com\/chat\/completions/);
  assert.match(worker, /GEMINI_API_KEY/);
  assert.match(worker, /generativelanguage\.googleapis\.com/);
  assert.match(worker, /x-goog-api-key/);
  assert.match(worker, /buildGeminiRequest/);
  assert.match(worker, /parseGeminiResponse/);
  assert.doesNotMatch(worker, /responseFormat/);
  assert.doesNotMatch(worker, /responseMimeType/);
  assert.doesNotMatch(worker, /responseSchema/);
  assert.doesNotMatch(worker, /mimeType/);
  assert.match(worker, /response_format/);
  assert.match(worker, /Simplified Chinese only/);
  assert.match(worker, /Do not use Traditional Chinese/);
  assert.match(worker, /TRADITIONAL_TO_SIMPLIFIED/);
  assert.match(worker, /toSimplifiedChinese/);
  assert.match(worker, /B64_INDEX_HTML/);
  assert.match(worker, /B64_APP_JS/);
  assert.match(worker, /B64_STYLES_CSS/);
  assert.match(worker, /enforceApiRateLimit/);
  assert.match(worker, /content-security-policy/);
  assert.doesNotMatch(worker, /env\.ASSETS\.fetch/);
});
