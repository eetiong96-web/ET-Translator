# Business Translator Design

## Goal

Build a mobile-first English to Chinese and Chinese to English translator for fast PM work inside a Chinese business environment.

## Product Shape

The first screen is the translator. It has a large paste/type area, direction controls, tone controls, a translate button, and a result area with translation, Hanyu Pinyin, meaning, business terms, alternatives, and copy actions.

## Translation Behavior

The app prefers Mainland corporate/business Chinese terms over literal everyday phrasing. It preserves names, dates, numbers, product names, acronyms, and formatting where possible. It explains key terms so the user can understand what colleagues mean, not just copy the output.

## Architecture

Use a static frontend hosted by Cloudflare Pages with a Pages Function at `/api/translate`. The function calls the OpenAI Responses API with a structured JSON response request. The API key stays in Cloudflare environment variables and is never sent to the browser.

## Data Storage

No Supabase is needed for v1. Translation history is saved locally in the browser only. Supabase would become useful later for accounts, synced phrase history, shared team glossaries, or admin-managed company terminology.

## Testing

Use Node's built-in test runner for shared prompt, validation, parsing, and request-building logic. Run a local no-dependency preview server to test the UI without requiring Wrangler.
