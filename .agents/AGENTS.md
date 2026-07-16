# Cloudflare Pages Deployment Guidelines

When helping the user deploy to Cloudflare Pages, you MUST adhere to the following platform constraints:

### 1. Direct Upload (Drag-and-Drop / Zip)
- **NO `wrangler.toml`**: Do not include this file in the upload package; Cloudflare will reject it.
- **NO `functions/` directory**: Cloudflare Pages direct upload does not compile this directory.
- **USE `_worker.js`**: Place backend API routing logic in a single `_worker.js` file at the root of the upload package.

### 2. GitHub Integration
- **Static Files Required**: The repository MUST contain static files (e.g., `index.html`).
- **Failure Condition**: If only a worker script (like `deploy-worker.js` or `_worker.js`) is pushed without an `index.html`, the build will fail with the error: `Could not detect a directory containing static files`.

### 3. Environment Variables
- Environment variables configured in the Cloudflare Pages dashboard only apply to **NEW** deployments.
- After adding variables (like API keys), you MUST explicitly remind the user to "Retry deployment" or trigger a new deployment for them to take effect.
