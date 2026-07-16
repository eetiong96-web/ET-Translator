import test from "node:test";
import assert from "node:assert/strict";

import {
  buildOpenAIRequest,
  buildSystemPrompt,
  parseOpenAIResponse,
  validateTranslateRequest
} from "../functions/_shared/translator.js";
import { onRequestPost } from "../functions/api/translate.js";

test("validateTranslateRequest normalizes a business translation request", () => {
  const request = validateTranslateRequest({
    text: "Can we align on scope before Friday?",
    direction: "auto",
    tone: "business",
    provider: "gemini"
  });

  assert.equal(request.text, "Can we align on scope before Friday?");
  assert.equal(request.direction, "auto");
  assert.equal(request.tone, "business");
  assert.equal(request.provider, "gemini");
});

test("validateTranslateRequest rejects empty, overly long, and invalid provider text", () => {
  assert.throws(() => validateTranslateRequest({ text: "   " }), /Enter something to translate/);
  assert.throws(() => validateTranslateRequest({ text: "x".repeat(5001) }), /Keep it under 5000 characters/);
  assert.throws(() => validateTranslateRequest({ text: "hello", provider: "bad-ai" }), /valid AI provider/);
});

test("system prompt asks for business Chinese, Hanyu Pinyin, and meanings", () => {
  const prompt = buildSystemPrompt();

  assert.match(prompt, /Mainland Chinese business/i);
  assert.match(prompt, /Simplified Chinese only/i);
  assert.match(prompt, /Do not use Traditional Chinese/i);
  assert.match(prompt, /Hanyu Pinyin/i);
  assert.match(prompt, /tone marks/i);
  assert.match(prompt, /meaning/i);
  assert.match(prompt, /交付物/);
});

test("system prompt handles mixed code review text without leaving English prose untranslated", () => {
  const prompt = buildSystemPrompt();

  assert.match(prompt, /Translate surrounding English prose into Simplified Chinese/i);
  assert.match(prompt, /preserve only code identifiers/i);
  assert.match(prompt, /orderPaymentComplianceEnable/);
  assert.match(prompt, /getId\(\)/);
  assert.match(prompt, /Do not copy English sentences into the Chinese translation/i);
  assert.match(prompt, /Translate every normal-language sentence/i);
  assert.match(prompt, /Preserve technical tokens only when they are exact identifiers/i);
});

test("parseOpenAIResponse normalizes Traditional Chinese output to Simplified Chinese", () => {
  const parsed = parseOpenAIResponse({
    output_text: JSON.stringify({
      sourceLanguage: "English",
      targetLanguage: "Chinese",
      translation: "我們需要先對齊範圍，確認優先級和交付風險。",
      pinyin: "Wǒmen xūyào xiān duìqí fànwéi, quèrèn yōuxiānjí hé jiāofù fēngxiǎn.",
      meaning: "We need to align on scope first and confirm priority and delivery risk.",
      terms: [
        {
          source: "scope",
          translation: "範圍",
          pinyin: "fànwéi",
          meaning: "the agreed boundary of work",
          note: "Traditional output should be converted."
        }
      ],
      alternatives: [
        {
          label: "Shorter",
          text: "請先確認會議範圍。",
          pinyin: "qǐng xiān quèrèn huìyì fànwéi",
          whenToUse: "Quick chat."
        }
      ],
      usageNotes: ["Use Mainland wording."],
      confidence: "high"
    })
  });

  assert.equal(parsed.translation, "我们需要先对齐范围，确认优先级和交付风险。");
  assert.equal(parsed.terms[0].translation, "范围");
  assert.equal(parsed.alternatives[0].text, "请先确认会议范围。");
});

test("buildOpenAIRequest creates a structured Responses API payload", () => {
  const request = buildOpenAIRequest(
    validateTranslateRequest({
      text: "推进这个项目",
      direction: "zh-en",
      tone: "plain"
    }),
    "gpt-test"
  );

  assert.equal(request.model, "gpt-test");
  assert.equal(request.text.format.type, "json_schema");
  assert.equal(request.text.format.name, "business_translation_result");
  assert.equal(request.input[0].role, "developer");
  assert.equal(request.input[1].role, "user");
  assert.equal(request.max_output_tokens, 1800);
  assert.match(JSON.stringify(request.text.format.schema), /pinyin/);
  assert.match(JSON.stringify(request.input), /推进这个项目/);
});

test("parseOpenAIResponse reads output_text JSON", () => {
  const parsed = parseOpenAIResponse({
    output_text: JSON.stringify({
      sourceLanguage: "English",
      targetLanguage: "Chinese",
      translation: "我们需要先对齐范围。",
      pinyin: "Wǒmen xūyào xiān duìqí fànwéi.",
      meaning: "We need to agree on scope first.",
      terms: [
        {
          source: "scope",
          translation: "范围",
          pinyin: "fànwéi",
          meaning: "the agreed boundary of work",
          note: "Common PM term."
        }
      ],
      alternatives: [],
      usageNotes: ["Business neutral tone."],
      confidence: "high"
    })
  });

  assert.equal(parsed.translation, "我们需要先对齐范围。");
  assert.equal(parsed.terms[0].pinyin, "fànwéi");
});

test("parseOpenAIResponse reads nested output content JSON", () => {
  const parsed = parseOpenAIResponse({
    output: [
      {
        content: [
          {
            type: "output_text",
            text: JSON.stringify({
              sourceLanguage: "Chinese",
              targetLanguage: "English",
              translation: "Drive the project forward.",
              pinyin: "tuījìn zhège xiàngmù",
              meaning: "Move this project ahead.",
              terms: [],
              alternatives: [],
              usageNotes: [],
              confidence: "medium"
            })
          }
        ]
      }
    ]
  });

  assert.equal(parsed.targetLanguage, "English");
  assert.equal(parsed.meaning, "Move this project ahead.");
});

test("onRequestPost returns a setup error when the API key is missing", async () => {
  const response = await onRequestPost({
    request: jsonRequest({ text: "hello", direction: "auto", tone: "business" }),
    env: {}
  });
  const body = await response.json();

  assert.equal(response.status, 500);
  assert.match(body.error, /OPENAI_API_KEY/);
});

test("onRequestPost calls OpenAI and returns parsed translation JSON", async () => {
  let capturedUrl = "";
  let capturedInit = {};

  const response = await onRequestPost({
    request: jsonRequest({ text: "Can we align on scope?", direction: "en-zh", tone: "business" }),
    env: {
      OPENAI_API_KEY: "sk-test",
      OPENAI_MODEL: "gpt-test",
      OPENAI_FETCH: async (url, init) => {
        capturedUrl = url;
        capturedInit = init;
        return Response.json({
          output_text: JSON.stringify({
            sourceLanguage: "English",
            targetLanguage: "Chinese",
            translation: "我们可以先对齐范围吗？",
            pinyin: "Wǒmen kěyǐ xiān duìqí fànwéi ma?",
            meaning: "Asks whether everyone can agree on the project scope first.",
            terms: [],
            alternatives: [],
            usageNotes: [],
            confidence: "high"
          })
        });
      }
    }
  });
  const body = await response.json();
  const upstreamBody = JSON.parse(capturedInit.body);

  assert.equal(response.status, 200);
  assert.equal(capturedUrl, "https://api.openai.com/v1/responses");
  assert.equal(capturedInit.headers.authorization, "Bearer sk-test");
  assert.equal(upstreamBody.model, "gpt-test");
  assert.equal(body.translation, "我们可以先对齐范围吗？");
  assert.equal(body.pinyin, "Wǒmen kěyǐ xiān duìqí fànwéi ma?");
});

test("onRequestPost returns a helpful upstream error", async () => {
  const response = await onRequestPost({
    request: jsonRequest({ text: "hello", direction: "auto", tone: "business" }),
    env: {
      OPENAI_API_KEY: "sk-test",
      OPENAI_FETCH: async () => Response.json({ error: { message: "rate limited" } }, { status: 429 })
    }
  });
  const body = await response.json();

  assert.equal(response.status, 502);
  assert.match(body.error, /rate limited/);
});

function jsonRequest(body) {
  return new Request("https://translator.test/api/translate", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body)
  });
}
