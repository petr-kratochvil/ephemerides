import sweph from "sweph";
import express, { Express, NextFunction, Request, Response } from "express";
import path from "path";
import { getPosition } from "./endpoints/getPosition";
import { gethouses } from "./endpoints/getHouses";
import { getTransits } from "./endpoints/getTransits";

const app: Express = express();
const port = process.env.PORT || 3601;

const swephPath = process.env.SWISSEPH_PATH || path.join(__dirname, "../swisseph_files");
// empty path will fallback to SEFLG_MOSEPH - Moshier ephemeris
sweph.set_ephe_path(swephPath || "");

// Parse JSON request body
app.use(express.json());

// Handle OPTIONS preflight requests
app.use((req, res, next) => {
  const origin =
    typeof req.headers.origin === "string" ? req.headers.origin : "*";

  res.setHeader("Access-Control-Allow-Origin", origin);
  res.setHeader("Vary", "Origin");

  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    res.writeHead(204);
    res.end();
    return;
  }

  next();
});

app.get("/", (req: Request, res: Response) => {
  res.send("Ephemerides express server /");
});

app.post("/position", getPosition);

app.post("/houses", gethouses);

app.post("/transits", getTransits);

// Malformed JSON bodies (thrown synchronously by express.json()) land here
app.use((err: unknown, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof SyntaxError && "body" in err) {
    res.status(400).json({ error: "Request body is not valid JSON" });
    return;
  }
  next(err);
});

// Only run app.listen when not running in Vercel (Serverless).
// Vercel handles the server binding automatically in production.
if (!process.env.VERCEL) {
  const server = app.listen(port, () => {
    console.log(`[Ephemerides]: Server is running at http://localhost:${port}`);
  });

  const shutdown = () => {
    console.log("[Ephemerides]: Shutting down, draining in-flight requests...");
    server.close(() => process.exit(0));
    // Force exit if some connection never finishes.
    setTimeout(() => process.exit(1), 10_000).unref();
  };

  process.on("SIGTERM", shutdown);
  process.on("SIGINT", shutdown);
}

export default app;
