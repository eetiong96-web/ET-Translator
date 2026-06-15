# ET Business Translator

A mobile-first English to Chinese and Chinese to English translator for PM work in a Chinese business environment. It returns the translation, Hanyu Pinyin, plain meaning, key business terms, and alternate phrasing.

## What It Does

- Translates English to Simplified Chinese and Chinese to English.
- Favors Mainland Chinese business terms such as `对齐`, `范围`, `交付物`, `优先级`, and `风险`.
- Shows Hanyu Pinyin with tone marks so Chinese text is readable.
- Explains word meaning for important business terms.
- Lets you switch between DeepSeek and Gemini from the page.
- Saves recent translations in the phone browser only.

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
6. Deploy and share the Cloudflare Worker URL with friends.

This project uses `index.js` as the Worker file. That one file serves the web page and also handles `/api/translate`, so Cloudflare must deploy it as a Worker, not as static assets only.

## Tests

Run:

```powershell
npm test
npm run check
```

## Notes

The DeepSeek and Gemini API keys stay on the Cloudflare server side. They are never placed in browser JavaScript.
