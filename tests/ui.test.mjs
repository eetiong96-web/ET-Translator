import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

test("index page includes the required translator controls and result regions", async () => {
  const html = await readFile(new URL("../public/index.html", import.meta.url), "utf8");

  for (const id of [
    "modeTabs",
    "translateView",
    "askView",
    "pageLanguageControl",
    "providerControl",
    "sourceText",
    "translateButton",
    "directionControl",
    "toneControl",
    "translationText",
    "pinyinText",
    "meaningText",
    "termsList",
    "historyList",
    "askForm",
    "askText",
    "askDirectionControl",
    "askProviderControl",
    "askButton",
    "askMessages",
    "askEmptyState",
    "copyAskButton"
  ]) {
    assert.match(html, new RegExp(`id="${id}"`));
  }

  assert.match(html, /ET Translator/);
  assert.match(html, /data-mode="translate"/);
  assert.match(html, /data-mode="ask"/);
  assert.match(html, /data-lang="en"/);
  assert.match(html, /data-lang="zh"/);
  assert.match(html, /data-provider="deepseek"/);
  assert.match(html, /data-provider="gemini"/);
  assert.match(html, /data-i18n="title"/);
  assert.match(html, /data-i18n="providerLabel"/);
  assert.match(html, /data-i18n-placeholder="sourcePlaceholder"/);
  assert.match(html, /Ask AI anything\. Example: translate this, make it natural, or explain the meaning\./);
  assert.match(html, /Hanyu Pinyin/);
  assert.match(html, /Meaning/);
  assert.doesNotMatch(html, /data-direction="auto"/);
  assert.doesNotMatch(html, /id="sampleButton"/);
  assert.doesNotMatch(html, /id="contextText"/);
  assert.doesNotMatch(html, /data-i18n="contextLabel"/);
});

test("client script sends translation requests and keeps translation text session-only", async () => {
  const script = await readFile(new URL("../public/app.js", import.meta.url), "utf8");
  const deployScript = await readFile(new URL("../deploy/app.js", import.meta.url), "utf8");

  assert.match(script, /\/api\/translate/);
  assert.match(script, /\/api\/ask/);
  assert.match(script, /localStorage/);
  assert.match(script, /sessionStorage/);
  assert.match(script, /TEXT_STORAGE/);
  assert.match(script, /RESULT_CACHE_KEY/);
  assert.match(script, /RESULT_CACHE_LIMIT = 30/);
  assert.match(script, /getCachedResult/);
  assert.match(script, /saveCachedResult/);
  assert.match(script, /createResultCacheKey/);
  assert.match(script, /renderTerms/);
  assert.match(script, /copyTranslation/);
  assert.match(script, /createHistoryId/);
  assert.match(script, /Math\.random/);
  assert.match(script, /readJsonResponse/);
  assert.match(script, /Ask AI anything\. Example: translate this, make it natural, or explain the meaning\./);
  assert.match(script, /clearSourceText/);
  assert.match(script, /resetResult/);
  assert.match(script, /API returned an empty response/);
  assert.match(script, /setStatus\("Error"\)/);
  assert.match(script, /UI_COPY/);
  assert.match(script, /setPageLanguage/);
  assert.match(script, /pageLanguage/);
  assert.match(script, /PAGE_LANGUAGE_KEY/);
  assert.match(script, /providerControl/);
  assert.match(script, /modeTabs/);
  assert.match(script, /askAi/);
  assert.match(script, /askMessages/);
  assert.match(script, /appendAskMessage/);
  assert.match(script, /renderAskMessages/);
  assert.match(script, /messages: history/);
  assert.match(script, /askDirectionControl/);
  assert.match(script, /askProviderControl/);
  assert.match(script, /provider: state\.provider/);
  assert.match(script, /provider: state\.askProvider/);
  assert.match(script, /direction: state\.askDirection/);
  assert.match(script, /DEVICE_ID_KEY/);
  assert.match(script, /deviceHeaders/);
  assert.match(script, /x-et-device-id/);
  assert.match(script, /clearLegacyPersistentTextStorage/);
  assert.match(script, /state\.provider = item\.provider \|\| "deepseek"/);
  assert.match(script, /result\.translation \|\| elements\.translationText\.textContent/);
  assert.doesNotMatch(script, /Pinyin: \$\{result\.pinyin\}/);
  assert.doesNotMatch(script, /Meaning: \$\{result\.meaning\}/);
  assert.doesNotMatch(script, /Needs attention/);
  assert.doesNotMatch(script, /sampleButton/);
  assert.doesNotMatch(script, /sampleText/);
  assert.doesNotMatch(script, /contextText/);

  assert.match(deployScript, /result\.translation \|\| elements\.translationText\.textContent/);
  assert.match(deployScript, /provider: state\.provider/);
  assert.match(deployScript, /provider: state\.askProvider/);
  assert.match(deployScript, /askAi/);
  assert.match(deployScript, /askMessages/);
  assert.match(deployScript, /RESULT_CACHE_KEY/);
  assert.match(deployScript, /TEXT_STORAGE/);
  assert.doesNotMatch(deployScript, /Pinyin: \$\{result\.pinyin\}/);
  assert.doesNotMatch(deployScript, /Meaning: \$\{result\.meaning\}/);
});

test("styles include mobile layout rules", async () => {
  const css = await readFile(new URL("../public/styles.css", import.meta.url), "utf8");

  assert.match(css, /@media \(max-width: 720px\)/);
  assert.match(css, /@media \(max-width: 420px\)/);
  assert.match(css, /grid-template-columns/);
  assert.match(css, /touch-action/);
  assert.match(css, /language-toggle/);
  assert.match(css, /mode-tabs/);
  assert.match(css, /ask-chat-panel/);
  assert.match(css, /ask-messages/);
  assert.match(css, /ask-message/);
  assert.match(css, /position: fixed/);
  assert.match(css, /safe-area-inset-bottom/);
  assert.match(css, /z-index: 50/);
  assert.match(css, /minmax\(0, 1\.4fr\) minmax\(0, 0\.8fr\) minmax\(0, 0\.8fr\)/);
  assert.match(css, /grid-column: auto/);
});
