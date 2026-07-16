# Business Translator Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a Cloudflare-ready mobile translator for English ⇄ Chinese business use with Hanyu Pinyin and word meanings.

**Architecture:** A static frontend in `public/` talks to a Cloudflare Pages Function at `/api/translate`. Shared translator logic lives in `functions/_shared/translator.js` so the function and tests use the same validation, prompt, schema, and response parsing. A no-dependency local server serves the frontend and mock/API endpoint for local QA.

**Tech Stack:** Vanilla HTML, CSS, JavaScript, Cloudflare Pages Functions, OpenAI Responses API, Node built-in tests.

---

### Task 1: Test Shared Translation Logic

**Files:**
- Create: `package.json`
- Create: `tests/translator.test.mjs`

- [ ] Write tests for request validation, prompt requirements, OpenAI request body shape, and response parsing.
- [ ] Run `node --test tests/translator.test.mjs` and verify it fails because `functions/_shared/translator.js` does not exist yet.

### Task 2: Implement Shared Translation Logic

**Files:**
- Create: `functions/_shared/translator.js`
- Modify: `tests/translator.test.mjs`

- [ ] Export `validateTranslateRequest`, `buildSystemPrompt`, `buildOpenAIRequest`, `parseOpenAIResponse`, and `jsonResponse`.
- [ ] Include Mainland business glossary guidance and require Hanyu Pinyin with tone marks for Chinese output and key terms.
- [ ] Run `node --test tests/translator.test.mjs` and verify all shared logic tests pass.

### Task 3: Implement Cloudflare API Function

**Files:**
- Create: `functions/api/translate.js`
- Modify: `tests/translator.test.mjs`

- [ ] Add API handler using `onRequestPost`.
- [ ] Return clear errors for missing body, missing `OPENAI_API_KEY`, invalid OpenAI responses, and upstream failures.
- [ ] Run `node --test tests/translator.test.mjs`.

### Task 4: Build Frontend

**Files:**
- Create: `public/index.html`
- Create: `public/styles.css`
- Create: `public/app.js`

- [ ] Build a mobile-first translator screen with direction, tone, input, output, Hanyu Pinyin, meanings, terms, alternatives, copy, paste, clear, and local history.
- [ ] Keep the UI dense, practical, and business-tool focused.
- [ ] Run `node --check public/app.js`.

### Task 5: Local Preview And Deployment Docs

**Files:**
- Create: `scripts/local-server.mjs`
- Create: `README.md`
- Create: `.gitignore`
- Create: `wrangler.toml`

- [ ] Add a local preview server that serves `public/` and `/api/translate`.
- [ ] Document Cloudflare Pages deployment and required `OPENAI_API_KEY`.
- [ ] Run tests, JavaScript syntax checks, and local server smoke checks.
