import {
  buildOpenAIRequest,
  jsonResponse,
  parseOpenAIResponse,
  validateTranslateRequest
} from "../_shared/translator.js";

const OPENAI_RESPONSES_URL = "https://api.openai.com/v1/responses";

export async function onRequestOptions() {
  return jsonResponse({ ok: true }, { status: 200 });
}

export async function onRequestPost({ request, env }) {
  try {
    const payload = await readJsonBody(request);
    const translationRequest = validateTranslateRequest(payload);

    if (!env?.OPENAI_API_KEY) {
      return jsonResponse(
        {
          error: "Missing OPENAI_API_KEY. Add it in Cloudflare Pages project settings before sharing this app."
        },
        { status: 500 }
      );
    }

    const fetcher = typeof env.OPENAI_FETCH === "function" ? env.OPENAI_FETCH : fetch;
    const upstream = await fetcher(OPENAI_RESPONSES_URL, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${env.OPENAI_API_KEY}`
      },
      body: JSON.stringify(buildOpenAIRequest(translationRequest, env.OPENAI_MODEL || "gpt-5.4-mini"))
    });

    const upstreamPayload = await readUpstreamPayload(upstream);

    if (!upstream.ok) {
      const message =
        upstreamPayload?.error?.message ||
        upstreamPayload?.message ||
        `OpenAI returned HTTP ${upstream.status}`;

      return jsonResponse(
        {
          error: `Translation service error: ${message}`
        },
        { status: 502 }
      );
    }

    return jsonResponse(parseOpenAIResponse(upstreamPayload), { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Something went wrong.";
    const status = isUserFixableError(message) ? 400 : 500;

    return jsonResponse({ error: message }, { status });
  }
}

async function readJsonBody(request) {
  try {
    return await request.json();
  } catch {
    throw new Error("Send a valid JSON request.");
  }
}

async function readUpstreamPayload(response) {
  const text = await response.text();

  if (!text) {
    return {};
  }

  try {
    return JSON.parse(text);
  } catch {
    return { message: text };
  }
}

function isUserFixableError(message) {
  return (
    message.includes("Enter something") ||
    message.includes("Keep it under") ||
    message.includes("valid translation direction") ||
    message.includes("valid tone") ||
    message.includes("valid AI provider") ||
    message.includes("valid JSON")
  );
}
