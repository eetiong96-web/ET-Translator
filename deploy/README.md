# ET Business Translator Dashboard Upload

This folder is ready for Cloudflare Pages dashboard drag-and-drop upload.

## Upload

1. In Cloudflare, go to **Workers & Pages**.
2. Choose **Create application**.
3. Choose **Pages**.
4. Choose **Use direct upload** or **Drag and drop**.
5. Upload this `deploy` folder.
6. Add this environment variable:
   - `OPENAI_API_KEY`: your OpenAI API key
7. Optional:
   - `OPENAI_MODEL`: `gpt-5.4-mini`
8. Deploy and share the Cloudflare Pages URL.

This folder uses `_worker.js` because Cloudflare dashboard drag-and-drop does not compile a `functions/` folder.

Supabase is not needed for this version.
