// Vercel deploys any file under /api as a serverless function, so this
// thin file is what Vercel actually loads; the real Express app lives in
// src/index.ts (compiled separately for local dev / Docker via `npm run build`).
import app from "../src/index";

module.exports = app;
