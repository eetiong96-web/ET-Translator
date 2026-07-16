const MAX_TEXT_LENGTH = 5000;
const OPENAI_RESPONSES_URL = "https://api.openai.com/v1/responses";
const DEEPSEEK_CHAT_URL = "https://api.deepseek.com/chat/completions";
const GEMINI_GENERATE_BASE_URL = "https://generativelanguage.googleapis.com/v1beta/models";
const USAGE_LOG_LIMIT = 300;
const USAGE_RETENTION_SECONDS = 60 * 60 * 24 * 90;
const RATE_LIMIT_TTL_SECONDS = 60 * 60 * 48;
const DEFAULT_DAILY_DEVICE_LIMIT = 0;
const DEFAULT_DAILY_TOTAL_LIMIT = 0;
const ADMIN_COOKIE_NAME = "et_admin";
const MODEL_RATES_USD_PER_MILLION = {
  "deepseek-v4-flash": { input: 0.14, output: 0.28 },
  "deepseek-v4-pro": { input: 1.74, output: 3.48 },
  gemini: { input: 0, output: 0 },
  openai: { input: 0, output: 0 }
};

const BUSINESS_TERMS = [
  ["alignment", "对齐", "duìqí", "Make sure people agree on the same goal or decision."],
  ["scope", "范围", "fànwéi", "The agreed boundary of what work is included."],
  ["deliverable", "交付物", "jiāofùwù", "A concrete output that must be delivered."],
  ["roadmap", "路线图", "lùxiàntú", "The planned sequence of product or project work."],
  ["priority", "优先级", "yōuxiānjí", "Relative importance or order of work."],
  ["stakeholder", "相关方", "xiāngguān fāng", "People or teams affected by a decision or project."],
  ["requirement", "需求", "xūqiú", "What the product, system, or business needs."],
  ["blocker", "阻塞点", "zǔsè diǎn", "Something preventing progress."],
  ["trade-off", "取舍", "qǔshě", "A decision where gaining one thing means giving up another."],
  ["rollout", "上线/灰度发布", "shàngxiàn / huīdù fābù", "Launch broadly, or launch gradually to a limited group first."],
  ["follow up", "跟进", "gēnjìn", "Continue checking or driving the next action."],
  ["deadline", "截止时间", "jiézhǐ shíjiān", "The final due time."],
  ["risk", "风险", "fēngxiǎn", "Something that could cause failure, delay, or loss."],
  ["decision", "决策", "juécè", "A formal choice or conclusion."],
  ["dependency", "依赖项", "yīlài xiàng", "Work or approval needed before another task can proceed."]
];

const TRADITIONAL_TO_SIMPLIFIED = {
  "與": "与",
  "專": "专",
  "業": "业",
  "東": "东",
  "兩": "两",
  "個": "个",
  "為": "为",
  "產": "产",
  "眾": "众",
  "優": "优",
  "會": "会",
  "傳": "传",
  "價": "价",
  "內": "内",
  "寫": "写",
  "軍": "军",
  "決": "决",
  "準": "准",
  "創": "创",
  "別": "别",
  "則": "则",
  "動": "动",
  "務": "务",
  "區": "区",
  "協": "协",
  "單": "单",
  "衛": "卫",
  "卻": "却",
  "廠": "厂",
  "參": "参",
  "雙": "双",
  "發": "发",
  "變": "变",
  "號": "号",
  "員": "员",
  "週": "周",
  "問": "问",
  "聖": "圣",
  "園": "园",
  "圖": "图",
  "團": "团",
  "國": "国",
  "圍": "围",
  "塊": "块",
  "場": "场",
  "壓": "压",
  "複": "复",
  "夠": "够",
  "頭": "头",
  "學": "学",
  "實": "实",
  "審": "审",
  "對": "对",
  "導": "导",
  "將": "将",
  "層": "层",
  "島": "岛",
  "帶": "带",
  "幫": "帮",
  "庫": "库",
  "廣": "广",
  "開": "开",
  "異": "异",
  "張": "张",
  "彙": "汇",
  "彈": "弹",
  "強": "强",
  "錄": "录",
  "後": "后",
  "從": "从",
  "復": "复",
  "徵": "征",
  "憶": "忆",
  "態": "态",
  "總": "总",
  "懸": "悬",
  "慣": "惯",
  "愛": "爱",
  "願": "愿",
  "戰": "战",
  "戶": "户",
  "擴": "扩",
  "擾": "扰",
  "報": "报",
  "擔": "担",
  "擬": "拟",
  "擁": "拥",
  "擇": "择",
  "擋": "挡",
  "擠": "挤",
  "揮": "挥",
  "損": "损",
  "換": "换",
  "據": "据",
  "擺": "摆",
  "攜": "携",
  "敗": "败",
  "數": "数",
  "無": "无",
  "舊": "旧",
  "時": "时",
  "暫": "暂",
  "會": "会",
  "術": "术",
  "機": "机",
  "權": "权",
  "條": "条",
  "來": "来",
  "極": "极",
  "構": "构",
  "標": "标",
  "樣": "样",
  "檢": "检",
  "樓": "楼",
  "檔": "档",
  "歡": "欢",
  "歲": "岁",
  "歷": "历",
  "歸": "归",
  "氣": "气",
  "沒": "没",
  "測": "测",
  "準": "准",
  "溝": "沟",
  "滿": "满",
  "灣": "湾",
  "點": "点",
  "獲": "获",
  "環": "环",
  "現": "现",
  "畫": "画",
  "監": "监",
  "盤": "盘",
  "眾": "众",
  "確": "确",
  "碼": "码",
  "種": "种",
  "稱": "称",
  "穩": "稳",
  "積": "积",
  "競": "竞",
  "節": "节",
  "範": "范",
  "簡": "简",
  "簽": "签",
  "籌": "筹",
  "類": "类",
  "級": "级",
  "約": "约",
  "線": "线",
  "練": "练",
  "組": "组",
  "細": "细",
  "經": "经",
  "結": "结",
  "給": "给",
  "統": "统",
  "維": "维",
  "網": "网",
  "緊": "紧",
  "編": "编",
  "緩": "缓",
  "縱": "纵",
  "績": "绩",
  "續": "续",
  "聯": "联",
  "職": "职",
  "腦": "脑",
  "臨": "临",
  "藝": "艺",
  "萬": "万",
  "華": "华",
  "藍": "蓝",
  "處": "处",
  "虛": "虚",
  "衝": "冲",
  "補": "补",
  "裝": "装",
  "製": "制",
  "見": "见",
  "規": "规",
  "視": "视",
  "覽": "览",
  "觀": "观",
  "觸": "触",
  "訂": "订",
  "計": "计",
  "訊": "讯",
  "討": "讨",
  "議": "议",
  "記": "记",
  "講": "讲",
  "詞": "词",
  "詢": "询",
  "試": "试",
  "誠": "诚",
  "話": "话",
  "該": "该",
  "詳": "详",
  "認": "认",
  "說": "说",
  "課": "课",
  "調": "调",
  "談": "谈",
  "請": "请",
  "讀": "读",
  "諮": "咨",
  "譯": "译",
  "讓": "让",
  "讚": "赞",
  "責": "责",
  "貴": "贵",
  "費": "费",
  "資": "资",
  "賬": "账",
  "質": "质",
  "購": "购",
  "趨": "趋",
  "車": "车",
  "軟": "软",
  "較": "较",
  "載": "载",
  "輔": "辅",
  "輕": "轻",
  "輪": "轮",
  "輯": "辑",
  "輸": "输",
  "轉": "转",
  "辦": "办",
  "邊": "边",
  "達": "达",
  "過": "过",
  "運": "运",
  "還": "还",
  "這": "这",
  "進": "进",
  "連": "连",
  "適": "适",
  "選": "选",
  "遺": "遗",
  "醫": "医",
  "釋": "释",
  "錄": "录",
  "鍵": "键",
  "門": "门",
  "問": "问",
  "間": "间",
  "開": "开",
  "隊": "队",
  "階": "阶",
  "際": "际",
  "險": "险",
  "隨": "随",
  "難": "难",
  "雖": "虽",
  "雙": "双",
  "雜": "杂",
  "電": "电",
  "靜": "静",
  "項": "项",
  "順": "顺",
  "預": "预",
  "領": "领",
  "題": "题",
  "額": "额",
  "類": "类",
  "風": "风",
  "驗": "验",
  "驅": "驱",
  "齊": "齐",
  "龍": "龙"
};

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/api/translate") {
      return handleTranslate(request, env);
    }

    if (url.pathname === "/api/ask") {
      return handleAsk(request, env);
    }

    if (url.pathname === "/api/usage") {
      return handleUsageApi(request, env);
    }

    if (url.pathname === "/api/usage/nickname") {
      return handleUsageNickname(request, env);
    }

    if (url.pathname === "/api/usage/clear") {
      return handleUsageClear(request, env);
    }

    if (url.pathname === "/admin/usage") {
      return handleUsagePage(request, env);
    }

    return withSecurityHeaders(await env.ASSETS.fetch(request));
  }
};

async function handleTranslate(request, env) {
  if (request.method === "OPTIONS") {
    return jsonResponse({ ok: true });
  }

  if (request.method !== "POST") {
    return jsonResponse({ error: "Use POST for translation." }, 405);
  }

  try {
    const payload = await request.json();
    const translationRequest = validateTranslateRequest(payload);
    const rateLimitError = await enforceApiRateLimit(request, env);

    if (rateLimitError) {
      return rateLimitError;
    }

    if (translationRequest.provider === "gemini") {
      if (!env.GEMINI_API_KEY) {
        return jsonResponse(
          { error: "Missing GEMINI_API_KEY. Add it in Cloudflare Worker Variables and Secrets." },
          500
        );
      }

      const geminiModel = env.GEMINI_MODEL || "gemini-3.5-flash";
      const upstream = await fetch(buildGeminiUrl(geminiModel), {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-goog-api-key": env.GEMINI_API_KEY
        },
        body: JSON.stringify(buildGeminiRequest(translationRequest))
      });
      const upstreamPayload = await readUpstreamPayload(upstream);

      if (!upstream.ok) {
        const message = upstreamPayload?.error?.message || upstreamPayload?.message || `HTTP ${upstream.status}`;
        return jsonResponse({ error: `Gemini error: ${message}` }, 502);
      }

      const result = parseGeminiResponse(upstreamPayload);
      await writeUsageLog(request, env, {
        feature: "translate",
        provider: "gemini",
        model: geminiModel,
        usage: extractGeminiUsage(upstreamPayload),
        ok: true
      });
      return jsonResponse(result);
    }

    if (!env.DEEPSEEK_API_KEY && !env.OPENAI_API_KEY) {
      return jsonResponse(
        { error: "Missing DEEPSEEK_API_KEY. Add it in Cloudflare Worker Variables and Secrets." },
        500
      );
    }

    if (env.DEEPSEEK_API_KEY) {
      const deepseekModel = env.DEEPSEEK_MODEL || "deepseek-v4-flash";
      const upstream = await fetch(DEEPSEEK_CHAT_URL, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          authorization: `Bearer ${env.DEEPSEEK_API_KEY}`
        },
        body: JSON.stringify(buildDeepSeekRequest(translationRequest, deepseekModel))
      });
      const upstreamPayload = await readUpstreamPayload(upstream);

      if (!upstream.ok) {
        const message = upstreamPayload?.error?.message || upstreamPayload?.message || `HTTP ${upstream.status}`;
        return jsonResponse({ error: `DeepSeek error: ${message}` }, 502);
      }

      const result = parseDeepSeekResponse(upstreamPayload);
      await writeUsageLog(request, env, {
        feature: "translate",
        provider: "deepseek",
        model: deepseekModel,
        usage: extractDeepSeekUsage(upstreamPayload),
        ok: true
      });
      return jsonResponse(result);
    }

    const openAIModel = env.OPENAI_MODEL || "gpt-5.4-mini";
    const upstream = await fetch(OPENAI_RESPONSES_URL, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${env.OPENAI_API_KEY}`
      },
      body: JSON.stringify(buildOpenAIRequest(translationRequest, openAIModel))
    });
    const upstreamPayload = await readUpstreamPayload(upstream);

    if (!upstream.ok) {
      const message = upstreamPayload?.error?.message || upstreamPayload?.message || `HTTP ${upstream.status}`;
      return jsonResponse({ error: `Translation service error: ${message}` }, 502);
    }

    const result = parseOpenAIResponse(upstreamPayload);
    await writeUsageLog(request, env, {
      feature: "translate",
      provider: "openai",
      model: openAIModel,
      usage: extractOpenAIUsage(upstreamPayload),
      ok: true
    });
    return jsonResponse(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Something went wrong.";
    const status = isUserFixableError(message) ? 400 : 500;
    return jsonResponse({ error: message }, status);
  }
}

async function handleAsk(request, env) {
  if (request.method === "OPTIONS") {
    return jsonResponse({ ok: true });
  }

  if (request.method !== "POST") {
    return jsonResponse({ error: "Use POST for Ask AI." }, 405);
  }

  try {
    const payload = await request.json();
    const askRequest = validateAskRequest(payload);
    const rateLimitError = await enforceApiRateLimit(request, env);

    if (rateLimitError) {
      return rateLimitError;
    }

    if (askRequest.provider === "gemini") {
      if (!env.GEMINI_API_KEY) {
        return jsonResponse(
          { error: "Missing GEMINI_API_KEY. Add it in Cloudflare Worker Variables and Secrets." },
          500
        );
      }

      const geminiModel = env.GEMINI_MODEL || "gemini-3.5-flash";
      const upstream = await fetch(buildGeminiUrl(geminiModel), {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-goog-api-key": env.GEMINI_API_KEY
        },
        body: JSON.stringify(buildGeminiAskRequest(askRequest))
      });
      const upstreamPayload = await readUpstreamPayload(upstream);

      if (!upstream.ok) {
        const message = upstreamPayload?.error?.message || upstreamPayload?.message || `HTTP ${upstream.status}`;
        return jsonResponse({ error: `Gemini error: ${message}` }, 502);
      }

      const result = parseAskResponse(parseGeminiText(upstreamPayload));
      await writeUsageLog(request, env, {
        feature: "ask",
        provider: "gemini",
        model: geminiModel,
        usage: extractGeminiUsage(upstreamPayload),
        ok: true
      });
      return jsonResponse(result);
    }

    if (!env.DEEPSEEK_API_KEY && !env.OPENAI_API_KEY) {
      return jsonResponse(
        { error: "Missing DEEPSEEK_API_KEY. Add it in Cloudflare Worker Variables and Secrets." },
        500
      );
    }

    if (env.DEEPSEEK_API_KEY) {
      const deepseekModel = env.DEEPSEEK_MODEL || "deepseek-v4-flash";
      const upstream = await fetch(DEEPSEEK_CHAT_URL, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          authorization: `Bearer ${env.DEEPSEEK_API_KEY}`
        },
        body: JSON.stringify(buildDeepSeekAskRequest(askRequest, deepseekModel))
      });
      const upstreamPayload = await readUpstreamPayload(upstream);

      if (!upstream.ok) {
        const message = upstreamPayload?.error?.message || upstreamPayload?.message || `HTTP ${upstream.status}`;
        return jsonResponse({ error: `DeepSeek error: ${message}` }, 502);
      }

      const result = parseAskResponse(upstreamPayload?.choices?.[0]?.message?.content || "");
      await writeUsageLog(request, env, {
        feature: "ask",
        provider: "deepseek",
        model: deepseekModel,
        usage: extractDeepSeekUsage(upstreamPayload),
        ok: true
      });
      return jsonResponse(result);
    }

    const openAIModel = env.OPENAI_MODEL || "gpt-5.4-mini";
    const upstream = await fetch(OPENAI_RESPONSES_URL, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${env.OPENAI_API_KEY}`
      },
      body: JSON.stringify(buildOpenAIAskRequest(askRequest, openAIModel))
    });
    const upstreamPayload = await readUpstreamPayload(upstream);

    if (!upstream.ok) {
      const message = upstreamPayload?.error?.message || upstreamPayload?.message || `HTTP ${upstream.status}`;
      return jsonResponse({ error: `Ask AI service error: ${message}` }, 502);
    }

    const result = parseAskResponse(extractOutputText(upstreamPayload));
    await writeUsageLog(request, env, {
      feature: "ask",
      provider: "openai",
      model: openAIModel,
      usage: extractOpenAIUsage(upstreamPayload),
      ok: true
    });
    return jsonResponse(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Something went wrong.";
    const status = isUserFixableError(message) ? 400 : 500;
    return jsonResponse({ error: message }, status);
  }
}

function buildDeepSeekRequest(request, model) {
  return {
    model,
    messages: [
      {
        role: "system",
        content: `${buildSystemPrompt()}

Return only valid JSON. Use exactly this JSON shape:
{
  "sourceLanguage": "English",
  "targetLanguage": "Chinese",
  "translation": "translated text",
  "pinyin": "Hanyu Pinyin with tone marks",
  "meaning": "plain English explanation",
  "terms": [
    {
      "source": "business term",
      "translation": "translated term",
      "pinyin": "term pinyin if Chinese is involved",
      "meaning": "simple English meaning",
      "note": "brief usage note"
    }
  ],
  "alternatives": [
    {
      "label": "Shorter",
      "text": "alternate wording",
      "pinyin": "pinyin if Chinese is involved",
      "whenToUse": "when to use this wording"
    }
  ],
  "usageNotes": ["brief note"],
  "confidence": "high"
}`
      },
      {
        role: "user",
        content: JSON.stringify(request)
      }
    ],
    response_format: { type: "json_object" },
    thinking: { type: "disabled" },
    max_tokens: 1800,
    stream: false
  };
}

function buildGeminiUrl(model) {
  const modelName = String(model || "gemini-3.5-flash").replace(/^models\//, "");
  return `${GEMINI_GENERATE_BASE_URL}/${modelName}:generateContent`;
}

function buildGeminiRequest(request) {
  return {
    system_instruction: {
      parts: [
        {
          text: `${buildSystemPrompt()}

Return only valid JSON matching the requested schema.`
        }
      ]
    },
    contents: [
      {
        parts: [
          {
            text: JSON.stringify(request)
          }
        ]
      }
    ],
    generationConfig: {
      temperature: 0.1,
      maxOutputTokens: 1800
    }
  };
}

function buildDeepSeekAskRequest(request, model) {
  return {
    model,
    messages: [
      {
        role: "system",
        content: `${buildAskSystemPrompt(request.direction)}

Return only valid JSON in this shape:
{
  "answer": "final natural translation",
  "pinyin": "Hanyu Pinyin with tone marks when the answer is Chinese, otherwise empty string"
}`
      },
      {
        role: "user",
        content: formatAskUserPrompt(request)
      }
    ],
    response_format: { type: "json_object" },
    thinking: { type: "disabled" },
    max_tokens: 1200,
    stream: false
  };
}

function buildGeminiAskRequest(request) {
  return {
    system_instruction: {
      parts: [
        {
          text: `${buildAskSystemPrompt(request.direction)}

Return only valid JSON in this shape: {"answer":"final natural translation","pinyin":"Hanyu Pinyin with tone marks when the answer is Chinese, otherwise empty string"}`
        }
      ]
    },
    contents: [
      {
        parts: [
          {
            text: formatAskUserPrompt(request)
          }
        ]
      }
    ],
    generationConfig: {
      temperature: 0.15,
      maxOutputTokens: 1200
    }
  };
}

function buildOpenAIAskRequest(request, model) {
  return {
    model,
    input: [
      {
        role: "developer",
        content: [{ type: "input_text", text: buildAskSystemPrompt(request.direction) }]
      },
      {
        role: "user",
        content: [{ type: "input_text", text: formatAskUserPrompt(request) }]
      }
    ],
    text: {
      format: {
        type: "json_schema",
        name: "ask_ai_result",
        strict: true,
        schema: {
          type: "object",
          additionalProperties: false,
          required: ["answer", "pinyin"],
          properties: {
            answer: { type: "string" },
            pinyin: { type: "string" }
          }
        }
      }
    },
    reasoning: { effort: "low" },
    max_output_tokens: 1200
  };
}

function validateTranslateRequest(input = {}) {
  const text = typeof input.text === "string" ? input.text.trim() : "";
  const direction = typeof input.direction === "string" ? input.direction : "auto";
  const tone = typeof input.tone === "string" ? input.tone : "business";
  const provider = typeof input.provider === "string" ? input.provider : "deepseek";
  const context = typeof input.context === "string" ? input.context.trim().slice(0, 1000) : "";

  if (!text) throw new Error("Enter something to translate.");
  if (text.length > MAX_TEXT_LENGTH) throw new Error("Keep it under 5000 characters.");
  if (!["auto", "en-zh", "zh-en"].includes(direction)) throw new Error("Choose a valid translation direction.");
  if (!["business", "plain", "polished"].includes(tone)) throw new Error("Choose a valid tone.");
  if (!["deepseek", "gemini"].includes(provider)) throw new Error("Choose a valid AI provider.");

  return { text, direction, tone, provider, context };
}

function validateAskRequest(input = {}) {
  const text = typeof input.text === "string" ? input.text.trim() : "";
  const direction = typeof input.direction === "string" ? input.direction : "en-zh";
  const provider = typeof input.provider === "string" ? input.provider : "deepseek";
  const messages = Array.isArray(input.messages)
    ? input.messages
        .slice(-8)
        .map((message) => ({
          role: message?.role === "assistant" ? "assistant" : "user",
          content: typeof message?.content === "string" ? message.content.trim().slice(0, 2000) : ""
        }))
        .filter((message) => message.content)
    : [];

  if (!text) throw new Error("Enter something for Ask AI.");
  if (text.length > MAX_TEXT_LENGTH) throw new Error("Keep it under 5000 characters.");
  if (!["en-zh", "zh-en"].includes(direction)) throw new Error("Choose a valid Ask AI direction.");
  if (!["deepseek", "gemini"].includes(provider)) throw new Error("Choose a valid AI provider.");

  return { text, direction, provider, messages };
}

function buildOpenAIRequest(request, model) {
  return {
    model,
    input: [
      {
        role: "developer",
        content: [{ type: "input_text", text: buildSystemPrompt() }]
      },
      {
        role: "user",
        content: [{ type: "input_text", text: JSON.stringify(request) }]
      }
    ],
    text: {
      format: {
        type: "json_schema",
        name: "business_translation_result",
        strict: true,
        schema: translationSchema()
      }
    },
    reasoning: { effort: "low" },
    max_output_tokens: 1800
  };
}

function buildSystemPrompt() {
  const glossary = BUSINESS_TERMS.map(
    ([english, chinese, pinyin, meaning]) => `- ${english}: ${chinese} (${pinyin}) means ${meaning}`
  ).join("\n");

  return `You are a fast English-Chinese business translator for a product manager working in a Mainland Chinese company.

Translate between English and Simplified Chinese only. Prefer Mainland Chinese business wording over casual, literal, or Taiwan/Hong Kong phrasing.

Rules:
- Detect source language when direction is auto.
- For English to Chinese, produce natural corporate Chinese for meetings, chat, specs, and project updates.
- Translate every normal-language sentence into the target language. Do not leave English or Chinese prose untranslated unless it is an exact preserved token.
- For mixed code review, PRD, ticket, or bug-report text, translate surrounding English prose into Simplified Chinese and preserve only code identifiers, method names, field names, class names, API names, file paths, URLs, acronyms, numbers, and exact error names.
- Preserve technical tokens only when they are exact identifiers or labels. Translate the explanation around them.
- Do not copy English sentences into the Chinese translation just because they contain code identifiers. Example: translate the explanation around orderPaymentComplianceEnable and getId(), but keep those identifiers unchanged.
- Do not use Traditional Chinese. Convert all Chinese output to Simplified Chinese before returning JSON, including translation, terms, and alternatives.
- For Chinese to English, translate the business meaning clearly rather than word-for-word.
- Preserve names, product names, acronyms, numbers, dates, times, links, bullet structure, and code-like tokens.
- Always include Hanyu Pinyin with tone marks for the Chinese translation or Chinese source phrase.
- Explain the plain meaning of the full sentence or paragraph in one short sentence.
- Extract only the most important business words or phrases. Return at most 3 terms.
- Return at most 1 alternative phrasing.
- Use Simplified Chinese characters.
- Do not wrap the JSON in markdown.

Tone modes:
- business: professional, concise, WeChat/work-chat friendly.
- plain: direct and easy to understand.
- polished: more formal and executive-ready.

Common business glossary to prefer where appropriate:
${glossary}`;
}

function buildAskSystemPrompt(direction) {
  const shared = [
    "You are a practical bilingual AI chat assistant for a product manager in a Mainland Chinese company.",
    "",
    "Talk directly with the user. Help with English/Chinese translation, natural business wording, meaning, reply drafting, and quick explanations.",
    "If the user asks a normal question, answer the question instead of forcing a translation.",
    "If the user asks for translation or wording, make it natural for workplace use.",
    "Keep answers concise and useful for work chat unless the user asks for more detail.",
    "Use Simplified Chinese for Chinese output. Never use Traditional Chinese.",
    "Preserve names, product names, acronyms, numbers, dates, links, code identifiers, file paths, and exact error names when needed.",
    "When the answer is Chinese, put Hanyu Pinyin with tone marks in the \"pinyin\" field. When the answer is English, use an empty pinyin string.",
    "Return only valid JSON with \"answer\" and \"pinyin\". Do not wrap JSON in markdown."
  ].join("\n");

  const directions = {
    "en-zh": "Preferred output language is Simplified Chinese unless the user clearly asks for English.",
    "zh-en": "Preferred output language is English unless the user clearly asks for Chinese."
  };

  return `${shared}\n\nConversation mode: ${directions[direction] || directions["en-zh"]}`;
}

function formatAskUserPrompt(request) {
  const history = (request.messages || [])
    .map((message) => `${message.role === "assistant" ? "AI" : "User"}: ${message.content}`)
    .join("\n");

  if (!history) {
    return request.text;
  }

  return `Recent conversation:\n${history}\n\nCurrent user message:\n${request.text}`;
}

function translationSchema() {
  return {
    type: "object",
    additionalProperties: false,
    required: [
      "sourceLanguage",
      "targetLanguage",
      "translation",
      "pinyin",
      "meaning",
      "terms",
      "alternatives",
      "usageNotes",
      "confidence"
    ],
    properties: {
      sourceLanguage: { type: "string" },
      targetLanguage: { type: "string" },
      translation: { type: "string" },
      pinyin: { type: "string" },
      meaning: { type: "string" },
      terms: {
        type: "array",
        items: {
          type: "object",
          additionalProperties: false,
          required: ["source", "translation", "pinyin", "meaning", "note"],
          properties: {
            source: { type: "string" },
            translation: { type: "string" },
            pinyin: { type: "string" },
            meaning: { type: "string" },
            note: { type: "string" }
          }
        }
      },
      alternatives: {
        type: "array",
        items: {
          type: "object",
          additionalProperties: false,
          required: ["label", "text", "pinyin", "whenToUse"],
          properties: {
            label: { type: "string" },
            text: { type: "string" },
            pinyin: { type: "string" },
            whenToUse: { type: "string" }
          }
        }
      },
      usageNotes: { type: "array", items: { type: "string" } },
      confidence: { type: "string", enum: ["high", "medium", "low"] }
    }
  };
}

function parseOpenAIResponse(payload) {
  const outputText = extractOutputText(payload);
  if (!outputText) throw new Error("The translation service returned no text.");

  return normalizeTranslationPayload(parseJsonText(outputText));
}

function parseDeepSeekResponse(payload) {
  const outputText = payload?.choices?.[0]?.message?.content || "";
  if (!outputText) throw new Error("DeepSeek returned no text.");

  return normalizeTranslationPayload(parseJsonText(outputText));
}

function parseGeminiResponse(payload) {
  const outputText = parseGeminiText(payload);

  if (!outputText) throw new Error("Gemini returned no text.");

  return normalizeTranslationPayload(parseJsonText(outputText));
}

function parseGeminiText(payload) {
  return (
    (typeof payload?.text === "string" ? payload.text : "") ||
    (payload?.candidates?.[0]?.content?.parts || [])
      .map((part) => (typeof part?.text === "string" ? part.text : ""))
      .join("")
  );
}

function parseAskResponse(outputText) {
  if (!outputText) throw new Error("The AI service returned no text.");

  const parsed = parseJsonText(outputText);

  if (!parsed || typeof parsed.answer !== "string") {
    throw new Error("The AI service returned an unexpected format.");
  }

  return {
    answer: toSimplifiedChinese(parsed.answer),
    pinyin: typeof parsed.pinyin === "string" ? parsed.pinyin : ""
  };
}

function parseJsonText(text) {
  const cleaned = text.trim().replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "");

  try {
    return JSON.parse(cleaned);
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new Error("AI returned an incomplete response. Please tap Translate again.");
    }

    throw error;
  }
}

function normalizeTranslationPayload(parsed) {
  if (!parsed || typeof parsed !== "object" || typeof parsed.translation !== "string") {
    throw new Error("The translation service returned an unexpected format.");
  }

  return {
    sourceLanguage: stringOrEmpty(parsed.sourceLanguage),
    targetLanguage: stringOrEmpty(parsed.targetLanguage),
    translation: stringOrEmpty(parsed.translation),
    pinyin: stringOrEmpty(parsed.pinyin),
    meaning: stringOrEmpty(parsed.meaning),
    terms: Array.isArray(parsed.terms) ? parsed.terms.map(normalizeTerm) : [],
    alternatives: Array.isArray(parsed.alternatives) ? parsed.alternatives.map(normalizeAlternative) : [],
    usageNotes: Array.isArray(parsed.usageNotes) ? parsed.usageNotes.map(String).filter(Boolean) : [],
    confidence: ["high", "medium", "low"].includes(parsed.confidence) ? parsed.confidence : "medium"
  };
}

function extractOutputText(payload) {
  if (payload && typeof payload.output_text === "string") return payload.output_text;

  for (const item of payload?.output || []) {
    for (const content of item?.content || []) {
      if (typeof content?.text === "string") return content.text;
    }
  }

  return "";
}

async function readUpstreamPayload(response) {
  const text = await response.text();
  if (!text) return {};

  try {
    return JSON.parse(text);
  } catch {
    return { message: text };
  }
}

function normalizeTerm(term) {
  return {
    source: stringOrEmpty(term?.source),
    translation: stringOrEmpty(term?.translation),
    pinyin: stringOrEmpty(term?.pinyin),
    meaning: stringOrEmpty(term?.meaning),
    note: stringOrEmpty(term?.note)
  };
}

function normalizeAlternative(alternative) {
  return {
    label: stringOrEmpty(alternative?.label),
    text: stringOrEmpty(alternative?.text),
    pinyin: stringOrEmpty(alternative?.pinyin),
    whenToUse: stringOrEmpty(alternative?.whenToUse)
  };
}

function isUserFixableError(message) {
  return (
    message.includes("Enter something") ||
    message.includes("Keep it under") ||
    message.includes("valid translation direction") ||
    message.includes("valid Ask AI direction") ||
    message.includes("valid tone") ||
    message.includes("valid AI provider")
  );
}

async function handleUsageApi(request, env) {
  const authError = await validateAdmin(request, env);
  if (authError) return authError;

  const snapshot = await readUsageSnapshot(env);
  return jsonResponse(snapshot);
}

async function handleUsageNickname(request, env) {
  const authError = await validateAdmin(request, env);
  if (authError) return authError;

  if (request.method !== "POST") {
    return jsonResponse({ error: "Use POST for nickname updates." }, 405);
  }

  if (!env.USAGE_KV) {
    return jsonResponse({ error: "Missing USAGE_KV binding." }, 500);
  }

  const payload = await request.json();
  const deviceKey = cleanNicknameKey(payload.deviceKey || "");
  const nickname = cleanNickname(payload.nickname || "");

  if (!deviceKey) {
    return jsonResponse({ error: "Missing device key." }, 400);
  }

  if (nickname) {
    await env.USAGE_KV.put(`nickname:${deviceKey}`, nickname);
  } else {
    await env.USAGE_KV.delete(`nickname:${deviceKey}`);
  }

  return jsonResponse({ ok: true, deviceKey, nickname });
}

async function handleUsageClear(request, env) {
  const authError = await validateAdmin(request, env);
  if (authError) return authError;

  if (request.method !== "POST") {
    return jsonResponse({ error: "Use POST to clear usage logs." }, 405);
  }

  if (!env.USAGE_KV) {
    return jsonResponse({ error: "Missing USAGE_KV binding." }, 500);
  }

  let deleted = 0;
  let cursor;

  do {
    const listed = await env.USAGE_KV.list({
      prefix: "usage:",
      cursor,
      limit: 1000
    });
    cursor = listed.cursor;

    await Promise.all(listed.keys.map(async (key) => {
      await env.USAGE_KV.delete(key.name);
      deleted += 1;
    }));
  } while (cursor);

  return jsonResponse({ ok: true, deleted });
}

async function handleUsagePage(request, env) {
  const authError = await validateAdmin(request, env);
  if (authError) return authError;

  const snapshot = await readUsageSnapshot(env);
  const headers = new Headers({
    "content-type": "text/html; charset=utf-8",
    "cache-control": "no-store"
  });
  const url = new URL(request.url);

  if ((url.searchParams.get("pin") || "") === env.ADMIN_PIN) {
    headers.set("set-cookie", await createAdminCookie(env));
  }

  return new Response(renderUsageHtml(snapshot), {
    headers: secureHeaders(headers)
  });
}

async function validateAdmin(request, env) {
  if (!env.ADMIN_PIN) {
    return htmlResponse(
      "Set ADMIN_PIN first",
      "Add a Cloudflare secret/text variable named ADMIN_PIN. Then open /admin/usage?pin=YOUR_PIN.",
      500
    );
  }

  const url = new URL(request.url);
  const suppliedPin = url.searchParams.get("pin") || request.headers.get("x-admin-pin") || "";
  const cookieToken = parseCookieHeader(request.headers.get("cookie"))[ADMIN_COOKIE_NAME] || "";
  const expectedToken = await createAdminToken(env);

  if (suppliedPin !== env.ADMIN_PIN && cookieToken !== expectedToken) {
    return htmlResponse("Usage dashboard locked", "Open /admin/usage?pin=YOUR_PIN after setting ADMIN_PIN.", 401);
  }

  return null;
}

async function createAdminCookie(env) {
  const token = await createAdminToken(env);
  return `${ADMIN_COOKIE_NAME}=${token}; Path=/; Max-Age=86400; HttpOnly; Secure; SameSite=Strict`;
}

async function createAdminToken(env) {
  return hashText(`admin:${env.ADMIN_PIN || ""}`);
}

function parseCookieHeader(value) {
  return String(value || "")
    .split(";")
    .map((part) => part.trim())
    .filter(Boolean)
    .reduce((cookies, part) => {
      const index = part.indexOf("=");
      if (index > 0) {
        cookies[part.slice(0, index)] = part.slice(index + 1);
      }
      return cookies;
    }, {});
}

async function enforceApiRateLimit(request, env) {
  if (!env.USAGE_KV) {
    return null;
  }

  const dailyDeviceLimit = readPositiveInteger(env.DAILY_DEVICE_LIMIT, DEFAULT_DAILY_DEVICE_LIMIT);
  const dailyTotalLimit = readPositiveInteger(env.DAILY_TOTAL_LIMIT, DEFAULT_DAILY_TOTAL_LIMIT);

  if (!dailyDeviceLimit && !dailyTotalLimit) {
    return null;
  }

  const day = new Date().toISOString().slice(0, 10);
  const identity = await getRateLimitIdentity(request);
  const deviceKey = `limit:${day}:device:${identity}`;
  const totalKey = `limit:${day}:total`;
  const [deviceCount, totalCount] = await Promise.all([
    readKvCounter(env, deviceKey),
    readKvCounter(env, totalKey)
  ]);

  if (dailyDeviceLimit && deviceCount >= dailyDeviceLimit) {
    return jsonResponse(
      { error: `Daily usage limit reached for this device. Try again tomorrow or raise DAILY_DEVICE_LIMIT in Cloudflare.` },
      429
    );
  }

  if (dailyTotalLimit && totalCount >= dailyTotalLimit) {
    return jsonResponse(
      { error: `Daily usage limit reached for this app. Try again tomorrow or raise DAILY_TOTAL_LIMIT in Cloudflare.` },
      429
    );
  }

  await Promise.all([
    writeKvCounter(env, deviceKey, deviceCount + 1),
    writeKvCounter(env, totalKey, totalCount + 1)
  ]);

  return null;
}

async function getRateLimitIdentity(request) {
  const ip = request.headers.get("cf-connecting-ip") || request.headers.get("x-forwarded-for") || "";
  const deviceId = cleanHeaderValue(request.headers.get("x-et-device-id") || "");
  const userAgent = request.headers.get("user-agent") || "";
  return (await hashText(`${deviceId}|${ip}|${userAgent}`)).slice(0, 32);
}

async function readKvCounter(env, key) {
  const value = Number(await env.USAGE_KV.get(key));
  return Number.isFinite(value) && value > 0 ? value : 0;
}

async function writeKvCounter(env, key, value) {
  await env.USAGE_KV.put(key, String(value), {
    expirationTtl: RATE_LIMIT_TTL_SECONDS
  });
}

function readPositiveInteger(value, fallback) {
  const parsed = Number(value || fallback);
  return Number.isFinite(parsed) && parsed > 0 ? Math.floor(parsed) : 0;
}

async function hashText(value) {
  const data = new TextEncoder().encode(String(value || ""));
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

async function writeUsageLog(request, env, entry) {
  if (!env.USAGE_KV) {
    return;
  }

  const now = new Date();
  const usage = normalizeUsage(entry.usage);
  const costUsd = estimateCostUsd(entry.provider, entry.model, usage);
  const device = getDeviceInfo(request);
  const id = crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  const log = {
    id,
    ts: now.toISOString(),
    day: now.toISOString().slice(0, 10),
    feature: entry.feature,
    provider: entry.provider,
    model: entry.model,
    ok: Boolean(entry.ok),
    inputTokens: usage.inputTokens,
    outputTokens: usage.outputTokens,
    totalTokens: usage.totalTokens,
    costUsd,
    device
  };

  await env.USAGE_KV.put(`usage:${log.day}:${now.getTime()}:${id}`, JSON.stringify(log), {
    expirationTtl: USAGE_RETENTION_SECONDS
  });
}

async function readUsageSnapshot(env) {
  if (!env.USAGE_KV) {
    return {
      configured: false,
      message: "Missing USAGE_KV binding. Add a Cloudflare KV namespace binding named USAGE_KV.",
      generatedAt: new Date().toISOString(),
      summary: emptyUsageSummary(),
      devices: [],
      logs: []
    };
  }

  const logs = [];
  const today = new Date();
  const days = [0, 1, 2, 3, 4, 5, 6].map((offset) => {
    const date = new Date(today);
    date.setUTCDate(date.getUTCDate() - offset);
    return date.toISOString().slice(0, 10);
  });

  for (const day of days) {
    let cursor;
    do {
      const listed = await env.USAGE_KV.list({
        prefix: `usage:${day}:`,
        cursor,
        limit: 100
      });
      cursor = listed.cursor;

      for (const key of listed.keys) {
        const value = await env.USAGE_KV.get(key.name, "json");
        if (value) logs.push(value);
      }
    } while (cursor && logs.length < USAGE_LOG_LIMIT);
  }

  logs.sort((a, b) => String(b.ts).localeCompare(String(a.ts)));
  const trimmed = logs.slice(0, USAGE_LOG_LIMIT);
  const devices = summarizeByDevice(trimmed);
  await attachNicknames(env, devices);
  attachLogNicknames(trimmed, devices);

  return {
    configured: true,
    generatedAt: new Date().toISOString(),
    summary: summarizeUsage(trimmed),
    devices,
    logs: trimmed
  };
}

function emptyUsageSummary() {
  return {
    calls: 0,
    inputTokens: 0,
    outputTokens: 0,
    totalTokens: 0,
    costUsd: 0
  };
}

function summarizeUsage(logs) {
  return logs.reduce((summary, log) => {
    summary.calls += 1;
    summary.inputTokens += Number(log.inputTokens || 0);
    summary.outputTokens += Number(log.outputTokens || 0);
    summary.totalTokens += Number(log.totalTokens || 0);
    summary.costUsd += Number(log.costUsd || 0);
    return summary;
  }, emptyUsageSummary());
}

function summarizeByDevice(logs) {
  const map = new Map();

  for (const log of logs) {
    const device = log.device || {};
    const key = createDeviceKey(device);
    const existing = map.get(key) || {
      deviceKey: key,
      deviceId: device.deviceId || "",
      deviceLabel: device.deviceLabel || "",
      phoneModel: device.phoneModel || "Unknown",
      platform: device.platform || "",
      browser: device.browser || "",
      screen: device.screen || "",
      timezone: device.timezone || "",
      country: device.country || "",
      calls: 0,
      inputTokens: 0,
      outputTokens: 0,
      totalTokens: 0,
      costUsd: 0,
      lastSeen: log.ts
    };

    existing.calls += 1;
    existing.inputTokens += Number(log.inputTokens || 0);
    existing.outputTokens += Number(log.outputTokens || 0);
    existing.totalTokens += Number(log.totalTokens || 0);
    existing.costUsd += Number(log.costUsd || 0);
    if (String(log.ts) > String(existing.lastSeen)) existing.lastSeen = log.ts;
    map.set(key, existing);
  }

  return Array.from(map.values()).sort((a, b) => b.costUsd - a.costUsd || b.calls - a.calls);
}

async function attachNicknames(env, devices) {
  await Promise.all(devices.map(async (device) => {
    device.nickname = await env.USAGE_KV.get(`nickname:${device.deviceKey}`) || "";
  }));
}

function attachLogNicknames(logs, devices) {
  const nicknames = new Map(devices.map((device) => [device.deviceKey, device.nickname || ""]));

  for (const log of logs) {
    const key = createDeviceKey(log.device || {});
    log.deviceKey = key;
    log.deviceNickname = nicknames.get(key) || "";
  }
}

function groupRecentLogs(logs) {
  const groups = new Map();

  for (const log of logs.slice(0, 80)) {
    const key = log.deviceKey || createDeviceKey(log.device || {});
    const existing = groups.get(key) || {
      key,
      label: formatDeviceName(log.device, log.deviceNickname),
      calls: 0,
      totalTokens: 0,
      costUsd: 0,
      lastSeen: log.ts,
      logs: []
    };

    existing.calls += 1;
    existing.totalTokens += Number(log.totalTokens || 0);
    existing.costUsd += Number(log.costUsd || 0);
    if (String(log.ts) > String(existing.lastSeen)) existing.lastSeen = log.ts;
    existing.logs.push(log);
    groups.set(key, existing);
  }

  return Array.from(groups.values()).sort((a, b) => String(b.lastSeen).localeCompare(String(a.lastSeen)));
}

function createDeviceKey(device = {}) {
  return cleanNicknameKey(device.deviceId || `${device.phoneModel || "Unknown"}|${device.userAgent || ""}`.slice(0, 80));
}

function cleanNicknameKey(value) {
  return String(value || "").replace(/[^\w .:/()[\]-]/g, "").slice(0, 140);
}

function cleanNickname(value) {
  return String(value || "").replace(/[<>]/g, "").trim().slice(0, 40);
}

function normalizeUsage(usage = {}) {
  const inputTokens = Number(usage.inputTokens || 0);
  const outputTokens = Number(usage.outputTokens || 0);
  const totalTokens = Number(usage.totalTokens || inputTokens + outputTokens || 0);

  return { inputTokens, outputTokens, totalTokens };
}

function extractDeepSeekUsage(payload) {
  const usage = payload?.usage || {};
  return {
    inputTokens: usage.prompt_tokens || usage.input_tokens || 0,
    outputTokens: usage.completion_tokens || usage.output_tokens || 0,
    totalTokens: usage.total_tokens || 0
  };
}

function extractGeminiUsage(payload) {
  const usage = payload?.usageMetadata || {};
  return {
    inputTokens: usage.promptTokenCount || 0,
    outputTokens: usage.candidatesTokenCount || 0,
    totalTokens: usage.totalTokenCount || 0
  };
}

function extractOpenAIUsage(payload) {
  const usage = payload?.usage || {};
  return {
    inputTokens: usage.input_tokens || 0,
    outputTokens: usage.output_tokens || 0,
    totalTokens: usage.total_tokens || 0
  };
}

function estimateCostUsd(provider, model, usage) {
  const key = provider === "deepseek" ? model : provider;
  const rates = MODEL_RATES_USD_PER_MILLION[key] || MODEL_RATES_USD_PER_MILLION[provider] || { input: 0, output: 0 };
  const inputCost = (Number(usage.inputTokens || 0) / 1_000_000) * rates.input;
  const outputCost = (Number(usage.outputTokens || 0) / 1_000_000) * rates.output;
  return Number((inputCost + outputCost).toFixed(8));
}

function getDeviceInfo(request) {
  const userAgent = request.headers.get("user-agent") || "";
  const cf = request.cf || {};
  const deviceLabel = cleanHeaderValue(request.headers.get("x-et-device-label") || "");
  const deviceId = cleanHeaderValue(request.headers.get("x-et-device-id") || "");
  const explicitModel = cleanHeaderValue(request.headers.get("x-et-phone-model") || "");
  const screen = cleanHeaderValue(request.headers.get("x-et-screen") || "");
  const timezone = cleanHeaderValue(request.headers.get("x-et-timezone") || "");

  return {
    deviceId,
    deviceLabel,
    phoneModel: explicitModel || parsePhoneModel(userAgent),
    platform: parsePlatform(userAgent),
    browser: parseBrowser(userAgent),
    screen,
    timezone,
    country: cf.country || request.headers.get("cf-ipcountry") || "",
    userAgent: userAgent.slice(0, 220)
  };
}

function cleanHeaderValue(value) {
  return String(value || "").replace(/[^\w .:/()[\]-]/g, "").slice(0, 120);
}

function parsePhoneModel(userAgent) {
  const appModel = userAgent.match(/ETPhoneModel\/([^;\s]+)/i);
  if (appModel) return decodeURIComponent(appModel[1]).replace(/\+/g, " ");

  const android = userAgent.match(/Android [^;)]*;\s*([^;)]+)\s+Build\//i);
  if (android) return android[1].trim();

  if (/iPhone/i.test(userAgent)) return "iPhone";
  if (/iPad/i.test(userAgent)) return "iPad";
  if (/Android/i.test(userAgent)) return "Android device";
  if (/Windows/i.test(userAgent)) return "Windows";
  if (/Macintosh/i.test(userAgent)) return "Mac";
  return "Unknown";
}

function parsePlatform(userAgent) {
  if (/Android/i.test(userAgent)) return "Android";
  if (/iPhone|iPad/i.test(userAgent)) return "iOS";
  if (/Windows/i.test(userAgent)) return "Windows";
  if (/Macintosh/i.test(userAgent)) return "Mac";
  if (/Linux/i.test(userAgent)) return "Linux";
  return "Web";
}

function parseBrowser(userAgent) {
  if (/Edg\//i.test(userAgent)) return "Microsoft Edge";
  if (/OPR\//i.test(userAgent)) return "Opera";
  if (/Chrome\//i.test(userAgent) && !/Chromium/i.test(userAgent)) return "Chrome";
  if (/Firefox\//i.test(userAgent)) return "Firefox";
  if (/Safari\//i.test(userAgent) && !/Chrome\//i.test(userAgent)) return "Safari";
  if (/wv\)|Version\/.*Chrome/i.test(userAgent)) return "Android WebView";
  return "Unknown";
}

function renderUsageHtml(snapshot) {
  const money = (value) => `$${Number(value || 0).toFixed(5)}`;
  const number = (value) => Number(value || 0).toLocaleString();
  const generatedAt = formatDashboardTime(snapshot.generatedAt);
  const rows = snapshot.devices.map((device) => `
      <tr>
        <td>${escapeHtml(device.phoneModel)}</td>
        <td>
          <form class="nickname-form" data-device-key="${escapeHtml(device.deviceKey)}">
            <input name="nickname" value="${escapeHtml(device.nickname || "")}" placeholder="Add nickname">
            <button type="submit">Save</button>
            <span class="save-state"></span>
          </form>
          <small>${escapeHtml(device.deviceLabel || "-")}</small>
        </td>
        <td>${escapeHtml(device.platform || "-")}</td>
        <td>${escapeHtml(device.browser || "-")}</td>
        <td>${escapeHtml(device.screen || "-")}</td>
        <td>${number(device.calls)}</td>
        <td>${number(device.totalTokens)}</td>
        <td>${money(device.costUsd)}</td>
        <td>${escapeHtml(formatDashboardTime(device.lastSeen))}</td>
      </tr>`).join("");
  const recentGroups = groupRecentLogs(snapshot.logs);
  const logGroups = recentGroups.map((group, index) => {
    const logRows = group.logs.map((log) => `
          <tr>
            <td>${escapeHtml(formatDashboardTime(log.ts))}</td>
            <td>${escapeHtml(log.feature)}</td>
            <td>${escapeHtml(log.provider)}</td>
            <td>${escapeHtml(log.model)}</td>
            <td>${number(log.totalTokens)}</td>
            <td>${money(log.costUsd)}</td>
          </tr>`).join("");

    return `
      <details class="device-log-group" ${index === 0 ? "open" : ""}>
        <summary>
          <span class="device-log-name">${escapeHtml(group.label)}</span>
          <span class="device-log-meta">${number(group.calls)} calls | ${number(group.totalTokens)} tokens | ${money(group.costUsd)} | Last ${escapeHtml(formatDashboardTime(group.lastSeen))}</span>
        </summary>
        <table class="recent-table">
          <thead><tr><th>Time</th><th>Feature</th><th>Provider</th><th>Model</th><th>Tokens</th><th>Cost</th></tr></thead>
          <tbody>${logRows}</tbody>
        </table>
      </details>`;
  }).join("");

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>ET Translator Usage</title>
    <style>
      body{margin:0;background:#f6f8fb;color:#17202a;font-family:Inter,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}
      main{width:min(1180px,calc(100% - 28px));margin:0 auto;padding:24px 0 44px}
      h1{margin:0 0 6px;font-size:2rem} h2{margin:24px 0 10px;font-size:1.15rem}
      .muted{color:#667085}.cards{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:10px;margin:18px 0}
      .card,table{border:1px solid #d9e0ea;border-radius:8px;background:#fff;box-shadow:0 12px 28px rgba(23,32,42,.07)}
      .card{padding:14px}.card strong{display:block;font-size:1.45rem;margin-top:4px}
      table{width:100%;border-collapse:separate;border-spacing:0;overflow:hidden}th,td{padding:10px;border-bottom:1px solid #e8edf4;text-align:left;font-size:.9rem;vertical-align:top}
      th{background:#eef3f8;color:#667085}tr:last-child td{border-bottom:0}.notice{padding:14px;border:1px solid #f59e0b;background:#fffbeb;border-radius:8px}
      .hint{margin:8px 0 18px;color:#667085;font-size:.92rem}.time{white-space:nowrap}
      .toolbar{display:flex;align-items:center;justify-content:space-between;gap:12px;margin:10px 0 18px}.toolbar p{margin:0}.clear-usage{border:1px solid #dc2626;border-radius:8px;background:#fff;color:#b91c1c;padding:9px 12px;font-weight:800;cursor:pointer}.clear-usage:disabled{opacity:.6;cursor:not-allowed}.clear-state{color:#667085;font-size:.9rem}
      .device-log-group{border:1px solid #d9e0ea;border-radius:8px;background:#fff;box-shadow:0 12px 28px rgba(23,32,42,.07);margin:10px 0;overflow:hidden}.device-log-group summary{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:12px 14px;cursor:pointer;list-style:none}.device-log-group summary::-webkit-details-marker{display:none}.device-log-group summary:before{content:"+";display:inline-grid;place-items:center;flex:0 0 22px;width:22px;height:22px;border-radius:999px;background:#eef3f8;color:#0f766e;font-weight:900}.device-log-group[open] summary:before{content:"-"}.device-log-name{font-weight:900}.device-log-meta{margin-left:auto;color:#667085;font-size:.88rem;text-align:right}.recent-table{border:0;border-top:1px solid #e8edf4;border-radius:0;box-shadow:none}
      small{display:block;margin-top:6px;color:#667085}.nickname-form{display:flex;gap:6px;align-items:center}.nickname-form input{min-width:150px;border:1px solid #d9e0ea;border-radius:8px;padding:8px}.nickname-form button{border:1px solid #0f766e;border-radius:8px;background:#0f766e;color:#fff;padding:8px 10px;font-weight:800}.save-state{color:#0f766e;font-size:.82rem}
      @media(max-width:720px){.cards{grid-template-columns:1fr 1fr}.toolbar{align-items:flex-start;flex-direction:column}.device-log-group summary{align-items:flex-start;flex-wrap:wrap}.device-log-meta{flex-basis:100%;margin-left:34px;text-align:left}table{display:block;overflow:auto}h1{font-size:1.55rem}}
    </style>
  </head>
  <body>
    <main>
      <h1>ET Translator Usage</h1>
      <div class="toolbar">
        <p class="muted">Last 7 days, latest ${USAGE_LOG_LIMIT} records. Generated ${escapeHtml(generatedAt)}.</p>
        <div>
          <button id="clearUsageButton" class="clear-usage" type="button">Clear logs</button>
          <span id="clearUsageState" class="clear-state"></span>
        </div>
      </div>
      ${snapshot.configured ? "" : `<p class="notice">${escapeHtml(snapshot.message)}</p>`}
      <section class="cards">
        <div class="card"><span class="muted">Calls</span><strong>${number(snapshot.summary.calls)}</strong></div>
        <div class="card"><span class="muted">Tokens</span><strong>${number(snapshot.summary.totalTokens)}</strong></div>
        <div class="card"><span class="muted">Output Tokens</span><strong>${number(snapshot.summary.outputTokens)}</strong></div>
        <div class="card"><span class="muted">Est. Cost</span><strong>${money(snapshot.summary.costUsd)}</strong></div>
      </section>
      <h2>By Device</h2>
      <p class="hint">Browsers hide exact laptop brand/model for privacy, so Windows/Mac can only show OS, browser, screen, and optional app label. Android APK can send phone model more accurately.</p>
      <table>
        <thead><tr><th>Phone / Device</th><th>Label</th><th>OS</th><th>Browser</th><th>Screen</th><th>Calls</th><th>Tokens</th><th>Cost</th><th>Last seen</th></tr></thead>
        <tbody>${rows || `<tr><td colspan="9" class="muted">No usage logged yet.</td></tr>`}</tbody>
      </table>
      <h2>Recent Calls</h2>
      ${logGroups || `<p class="notice muted">No recent calls yet.</p>`}
    </main>
    <script>
      const params = new URLSearchParams(location.search);
      const pinFromUrl = params.get("pin") || "";
      const storedPin = sessionStorage.getItem("et-admin-pin") || "";
      const pin = pinFromUrl || storedPin;

      if (pinFromUrl) {
        sessionStorage.setItem("et-admin-pin", pinFromUrl);
        params.delete("pin");
        const cleanSearch = params.toString();
        history.replaceState(null, "", location.pathname + (cleanSearch ? "?" + cleanSearch : "") + location.hash);
      }

      const adminHeaders = pin ? { "x-admin-pin": pin } : {};
      const clearButton = document.getElementById("clearUsageButton");
      const clearState = document.getElementById("clearUsageState");
      clearButton?.addEventListener("click", async () => {
        const ok = confirm("Clear all backend usage logs? Nicknames will be kept.");
        if (!ok) return;

        clearButton.disabled = true;
        clearState.textContent = "Clearing...";

        const response = await fetch("/api/usage/clear", {
          method: "POST",
          headers: adminHeaders
        });

        if (response.ok) {
          const result = await response.json();
          clearState.textContent = "Cleared " + (result.deleted || 0) + " logs";
          setTimeout(() => location.reload(), 600);
        } else {
          clearState.textContent = "Clear failed";
          clearButton.disabled = false;
        }
      });

      for (const form of document.querySelectorAll(".nickname-form")) {
        form.addEventListener("submit", async (event) => {
          event.preventDefault();
          const status = form.querySelector(".save-state");
          status.textContent = "Saving...";
          const response = await fetch("/api/usage/nickname", {
            method: "POST",
            headers: { "content-type": "application/json", ...adminHeaders },
            body: JSON.stringify({
              deviceKey: form.dataset.deviceKey,
              nickname: form.elements.nickname.value
            })
          });
          status.textContent = response.ok ? "Saved" : "Error";
          if (response.ok) setTimeout(() => location.reload(), 450);
        });
      }
    </script>
  </body>
</html>`;
}

function formatDeviceName(device = {}, nickname = "") {
  const pieces = [nickname, device.phoneModel, device.browser, device.screen].filter(Boolean);
  return pieces.length ? pieces.join(" / ") : "Unknown";
}

function formatDashboardTime(value) {
  if (!value) return "-";

  try {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return String(value);
    return new Intl.DateTimeFormat("en-SG", {
      timeZone: "Asia/Singapore",
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false
    }).format(date).replace(",", "") + " SGT";
  } catch {
    return String(value);
  }
}

function htmlResponse(title, message, status = 200) {
  return new Response(`<!doctype html><meta charset="utf-8"><title>${escapeHtml(title)}</title><body style="font-family:system-ui;padding:24px"><h1>${escapeHtml(title)}</h1><p>${escapeHtml(message)}</p></body>`, {
    status,
    headers: secureHeaders({ "content-type": "text/html; charset=utf-8", "cache-control": "no-store" })
  });
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: secureHeaders({
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store"
    })
  });
}

function withSecurityHeaders(response) {
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: secureHeaders(response.headers)
  });
}

function secureHeaders(inputHeaders = {}) {
  const headers = new Headers(inputHeaders);
  headers.set("x-content-type-options", "nosniff");
  headers.set("x-frame-options", "DENY");
  headers.set("referrer-policy", "no-referrer");
  headers.set("permissions-policy", "camera=(), microphone=(), geolocation=(), payment=()");
  headers.set(
    "content-security-policy",
    "default-src 'self'; connect-src 'self'; img-src 'self' data:; style-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-inline'; base-uri 'none'; frame-ancestors 'none'; form-action 'self'"
  );
  return headers;
}

function stringOrEmpty(value) {
  return typeof value === "string" ? toSimplifiedChinese(value) : "";
}

function toSimplifiedChinese(value) {
  let output = "";

  for (const character of value) {
    output += TRADITIONAL_TO_SIMPLIFIED[character] || character;
  }

  return output;
}
