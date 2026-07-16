import { readFile, writeFile } from "node:fs/promises";

const indexHtml = await readFile(new URL("../deploy/index.html", import.meta.url));
const appJs = await readFile(new URL("../deploy/app.js", import.meta.url));
const stylesCss = await readFile(new URL("../deploy/styles.css", import.meta.url));
const baseWorker = await readFile(new URL("../deploy/_worker.js", import.meta.url), "utf8");

const assetConstants = `const B64_INDEX_HTML = "${indexHtml.toString("base64")}";
const B64_APP_JS = "${appJs.toString("base64")}";
const B64_STYLES_CSS = "${stylesCss.toString("base64")}";

const INDEX_HTML = decodeBase64(B64_INDEX_HTML);
const APP_JS = decodeBase64(B64_APP_JS);
const STYLES_CSS = decodeBase64(B64_STYLES_CSS);
`;

const assetHelpers = `function assetResponse(body, contentType) {
  return new Response(body, {
    headers: secureHeaders({
      "content-type": contentType,
      "cache-control": "public, max-age=300"
    })
  });
}

function decodeBase64(value) {
  const binary = atob(value);
  const bytes = new Uint8Array(binary.length);

  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }

  return new TextDecoder().decode(bytes);
}
`;

const worker = baseWorker
  .replace(
    'const OPENAI_RESPONSES_URL = "https://api.openai.com/v1/responses";',
    'const OPENAI_RESPONSES_URL = "https://api.openai.com/v1/responses";\n' + assetConstants
  )
  .replace(
    "    return withSecurityHeaders(await env.ASSETS.fetch(request));",
    `    if (url.pathname === "/" || url.pathname === "/index.html") {
      return assetResponse(INDEX_HTML, "text/html; charset=utf-8");
    }

    if (url.pathname === "/app.js") {
      return assetResponse(APP_JS, "text/javascript; charset=utf-8");
    }

    if (url.pathname === "/styles.css") {
      return assetResponse(STYLES_CSS, "text/css; charset=utf-8");
    }

    return jsonResponse({ error: "Not found." }, 404);`
  )
  .replace("\nfunction validateTranslateRequest", "\n" + assetHelpers + "\nfunction validateTranslateRequest");

await writeFile(new URL("../deploy-worker.js", import.meta.url), worker);
