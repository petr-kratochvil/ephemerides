import sweph from "sweph";
import express, { Express, Request, Response } from "express";
import { getPosition } from "../src/endpoints/getPosition";
import { gethouses } from "../src/endpoints/getHouses";
import { getTransits } from "../src/endpoints/getTransits";

const app: Express = express();
const port = process.env.PORT || 3601;

// path to ephemeris data
// For flag SEFLG_MOSEPH, path null can be used
// sweph.set_ephe_path('null');
sweph.set_ephe_path(__dirname + "/../swisseph_files");

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

// Only run app.listen when running locally.
// Vercel handles the server binding automatically in production.
if (process.env.NODE_ENV !== "production") {
  app.listen(port, () => {
    console.log(`[Ephemerides]: Server is running at http://localhost:${port}`);
  });
}

module.exports = app;
