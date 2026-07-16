import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { onRequestPost } from "../functions/api/translate.js";

const publicDir = fileURLToPath(new URL("../public/", import.meta.url));
const port = Number(process.env.PORT || 4173);

const contentTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".webmanifest": "application/manifest+json; charset=utf-8"
};

const server = createServer(async (req, res) => {
  try {
    const requestUrl = new URL(req.url || "/", `http://${req.headers.host || "localhost"}`);

    if (requestUrl.pathname === "/api/translate" && req.method === "POST") {
      await handleTranslate(req, res);
      return;
    }

    if (requestUrl.pathname === "/api/ask" && req.method === "POST") {
      const body = await readRequestBody(req);
      sendJson(res, mockAsk(body), 200);
      return;
    }

    await serveStatic(requestUrl.pathname, res);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Server error";
    sendJson(res, { error: message }, 500);
  }
});

server.listen(port, () => {
  console.log(`Translator running at http://localhost:${port}`);
});

async function handleTranslate(req, res) {
  const body = await readRequestBody(req);

  if (!process.env.OPENAI_API_KEY) {
    sendJson(res, mockTranslation(body), 200);
    return;
  }

  const request = new Request("http://localhost/api/translate", {
    method: "POST",
    headers: {
      "content-type": req.headers["content-type"] || "application/json"
    },
    body
  });

  const response = await onRequestPost({
    request,
    env: {
      OPENAI_API_KEY: process.env.OPENAI_API_KEY,
      OPENAI_MODEL: process.env.OPENAI_MODEL,
      OPENAI_FETCH: fetch
    }
  });

  res.writeHead(response.status, Object.fromEntries(response.headers));
  res.end(await response.text());
}

async function serveStatic(pathname, res) {
  const cleanPath = decodeURIComponent(pathname === "/" ? "/index.html" : pathname);
  const targetPath = path.resolve(publicDir, `.${cleanPath}`);

  if (!targetPath.startsWith(publicDir)) {
    sendText(res, "Forbidden", 403, "text/plain; charset=utf-8");
    return;
  }

  const extension = path.extname(targetPath);
  const contentType = contentTypes[extension] || "application/octet-stream";

  try {
    sendText(res, await readFile(targetPath), 200, contentType);
  } catch {
    sendText(res, "Not found", 404, "text/plain; charset=utf-8");
  }
}

function readRequestBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on("data", (chunk) => chunks.push(chunk));
    req.on("error", reject);
    req.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
  });
}

function mockTranslation(body) {
  let input = {};

  try {
    input = JSON.parse(body || "{}");
  } catch {
    input = {};
  }

  const text = String(input.text || "");
  const hasChinese = /[\u3400-\u9fff]/.test(text);

  if (hasChinese) {
    return {
      sourceLanguage: "Chinese",
      targetLanguage: "English",
      translation: "We need to align on the project scope and deliverables first, otherwise next week's rollout will carry risk.",
      pinyin: "Wǒmen xūyào xiān duìqí xiàngmù fànwéi hé jiāofùwù, fǒuzé xià zhōu shàngxiàn huì yǒu fēngxiǎn.",
      meaning: "The team should agree on what is included and what must be delivered before launch, because there is risk if they do not.",
      terms: [
        {
          source: "对齐",
          translation: "align",
          pinyin: "duìqí",
          meaning: "Make sure everyone agrees on the same understanding or decision.",
          note: "Very common in Chinese corporate discussion."
        },
        {
          source: "交付物",
          translation: "deliverable",
          pinyin: "jiāofùwù",
          meaning: "The concrete output the team must produce.",
          note: "Common PM and project-management term."
        }
      ],
      alternatives: [
        {
          label: "Shorter",
          text: "We should align scope and deliverables before rollout.",
          pinyin: "",
          whenToUse: "Quick work chat."
        }
      ],
      usageNotes: ["Local mock result. Add OPENAI_API_KEY for real translation."],
      confidence: "medium"
    };
  }

  return {
    sourceLanguage: "English",
    targetLanguage: "Chinese",
    translation: "我们需要先对齐项目范围和交付物，否则下周上线会有风险。",
    pinyin: "Wǒmen xūyào xiān duìqí xiàngmù fànwéi hé jiāofùwù, fǒuzé xià zhōu shàngxiàn huì yǒu fēngxiǎn.",
    meaning: "The team should agree on what is included and what must be delivered before launch, because there is risk if they do not.",
    terms: [
      {
        source: "align",
        translation: "对齐",
        pinyin: "duìqí",
        meaning: "Make sure everyone agrees on the same understanding or decision.",
        note: "Natural business Chinese, especially for PM work."
      },
      {
        source: "deliverable",
        translation: "交付物",
        pinyin: "jiāofùwù",
        meaning: "The concrete output the team must produce.",
        note: "Common project-management term."
      }
    ],
    alternatives: [
      {
        label: "More formal",
        text: "建议先明确项目范围和交付物，否则下周上线存在一定风险。",
        pinyin: "Jiànyì xiān míngquè xiàngmù fànwéi hé jiāofùwù, fǒuzé xià zhōu shàngxiàn cúnzài yídìng fēngxiǎn.",
        whenToUse: "Email or leadership update."
      }
    ],
    usageNotes: ["Local mock result. Add OPENAI_API_KEY for real translation."],
    confidence: "medium"
  };
}

function mockAsk(body) {
  let input = {};

  try {
    input = JSON.parse(body || "{}");
  } catch {
    input = {};
  }

  const direction = String(input.direction || "en-zh");
  const samples = {
    "en-zh": "我们需要先对齐项目范围和交付物，否则下周上线会有风险。\n\nPinyin: Wǒmen xūyào xiān duìqí xiàngmù fànwéi hé jiāofùwù, fǒuzé xià zhōu shàngxiàn huì yǒu fēngxiǎn.",
    "zh-en": "We need to align on the project scope and deliverables first, otherwise next week's rollout will carry risk."
  };

  return {
    answer: samples[direction] || samples["en-zh"]
  };
}

function sendJson(res, payload, status = 200) {
  sendText(res, JSON.stringify(payload), status, "application/json; charset=utf-8");
}

function sendText(res, body, status, contentType) {
  res.writeHead(status, {
    "content-type": contentType,
    "cache-control": "no-store"
  });
  res.end(body);
}
