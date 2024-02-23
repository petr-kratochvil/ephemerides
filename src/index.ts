import sweph from "sweph";
import express, { Express, Request, Response } from "express";
import { getPosition } from "./api/getPosition";
import { gethouses } from "./api/getHouses";

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
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Origin', req.headers.origin);
    res.header("Access-Control-Allow-Headers", "Content-type");
    res.send();
  } else {
    next();
  }
})

app.get("/", (req: Request, res: Response) => {
  res.send("Ephemerides express server /");
});

app.get("/position", getPosition);
app.post("/position", getPosition);

app.get("/houses", gethouses);
app.post("/houses", gethouses);

app.listen(port, () => {
  console.log(`[Ephemerides]: Server is running at http://localhost:${port}`);
});
