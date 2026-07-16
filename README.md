# ET Business Translator

A mobile-first English to Chinese and Chinese to English translator for PM work in a Chinese business environment. It returns the translation, Hanyu Pinyin, plain meaning, key business terms, and alternate phrasing.

## What It Does

- Translates English to Simplified Chinese and Chinese to English.
- Favors Mainland Chinese business terms such as `对齐`, `范围`, `交付物`, `优先级`, and `风险`.
- Shows Hanyu Pinyin with tone marks so Chinese text is readable.
- Explains word meaning for important business terms.
- Lets you switch between DeepSeek and Gemini from the page.
- Keeps recent translations in the current browser/app session only.
- Logs token usage by device when Cloudflare KV is connected.
- Adds basic daily rate limits to reduce accidental API credit burn.

Supabase is not needed for v1. Add Supabase later only if you want accounts, synced history, a shared team glossary, or admin-managed company terms.

## Local Preview

Run:

```powershell
node scripts/local-server.mjs
```

Open:

```text
http://localhost:4173
```

Without an API key, the local server returns a mock translation so you can test the interface. For real translations locally:

```powershell
$env:DEEPSEEK_API_KEY="your_api_key_here"
node scripts/local-server.mjs
```

## Cloudflare Worker Hosting

Use this when deploying from GitHub.

1. Push this folder to your GitHub repo.
2. In Cloudflare, create a Worker project from that GitHub repo.
3. Build command: `npm run deploy`
4. Add secret variables in Cloudflare:
   - Name: `DEEPSEEK_API_KEY`
   - Value: your DeepSeek API key
   - Name: `GEMINI_API_KEY`
   - Value: your Gemini API key
5. Optional variables:
   - Name: `DEEPSEEK_MODEL`
   - Value: `deepseek-v4-flash`
   - Name: `GEMINI_MODEL`
   - Value: `gemini-3.5-flash`
   - Name: `ADMIN_PIN`
   - Value: any private PIN you choose for the usage dashboard
   - Name: `DAILY_DEVICE_LIMIT`
   - Value: optional, defaults to `50`
   - Name: `DAILY_TOTAL_LIMIT`
   - Value: optional, defaults to `200`
6. Optional usage storage:
   - In Cloudflare, create a KV namespace.
   - Bind it to this Worker with the variable/binding name `USAGE_KV`.
   - Without `USAGE_KV`, translation still works but usage will not be stored.
7. Deploy and share the Cloudflare Worker URL with friends.

This project uses `index.js` as the Worker file. That one file serves the web page and also handles `/api/translate`, so Cloudflare must deploy it as a Worker, not as static assets only.

## Usage Dashboard

After adding `ADMIN_PIN` and binding `USAGE_KV`, open:

```text
https://your-worker-url/admin/usage?pin=YOUR_PIN
```

After the dashboard opens, the app removes the PIN from the browser address bar and uses a short admin session cookie for dashboard actions.

The dashboard shows calls, token usage, estimated cost, and device grouping. Exact phone model is only available when the browser or Android APK sends it. Normal mobile browsers may hide the model for privacy.

## Tests

Run:

```powershell
npm test
npm run check
```

## Notes

The DeepSeek and Gemini API keys stay on the Cloudflare server side. They are never placed in browser JavaScript.
