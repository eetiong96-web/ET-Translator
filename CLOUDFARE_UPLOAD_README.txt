ET Business Translator - What To Upload

Best option for DeepSeek API:
1. Use deploy-worker.js.
2. Cloudflare path: Workers & Pages > Create Worker > Start with Hello World > Deploy > Edit code.
3. Delete the Hello World code.
4. Paste everything from deploy-worker.js.
5. Save and deploy.
6. Add secret: DEEPSEEK_API_KEY.

Alternative Pages static upload:
1. Upload deploy-upload.zip to Cloudflare Pages direct upload.
2. This may not run the private API on every Cloudflare upload mode.
3. If /api/translate returns 404, use deploy-worker.js instead.

