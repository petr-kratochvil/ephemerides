import sweph from "sweph";
import cors from "cors";
import express, { Express, NextFunction, Request, Response } from "express";
import path from "path";
import morgan from "morgan";
import helmet from "helmet";
import { getPosition } from "./endpoints/getPosition";
import { gethouses } from "./endpoints/getHouses";
import { getTransits } from "./endpoints/getTransits";

const app: Express = express();
const port = process.env.PORT || 3601;

const swephPath =
  process.env.SWISSEPH_PATH || path.join(__dirname, "../swisseph_files");
// empty path will fallback to SEFLG_MOSEPH - Moshier ephemeris
sweph.set_ephe_path(swephPath || "");

// morgan (logging)
if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
} else if (!process.env.VERCEL) {
  // Skip for Vercel (it provides its own logging)
  app.use(morgan("combined"));
}

// cors - any frontend may call it
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
    maxAge: 86400,
  }),
);

// helmet (HTTP security headers)
app.use(
  helmet({
    // CSP not needed for a pure backend API
    contentSecurityPolicy: false,
    // Cross origin allowed
    crossOriginResourcePolicy: { policy: "cross-origin" }
  }),
);

app.use((_req, res, next) => {
  res.setHeader("Cache-Control", "no-store");
  next();
});

// Parse JSON request body
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("Ephemerides express server /");
});

app.post("/position", getPosition);

app.post("/houses", gethouses);

app.post("/transits", getTransits);

// Handle invalid JSON in request body
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
