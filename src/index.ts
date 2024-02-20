import sweph from "sweph";
import express, { Express, Request, Response } from "express";
import { getPosition } from "./api/getPosition";
import { gethouses } from "./api/getHouses";

const app: Express = express();
const port = process.env.PORT || 3000;

// path to ephemeris data
// For flag SEFLG_MOSEPH, path null can be used
// sweph.set_ephe_path('null');
sweph.set_ephe_path(__dirname + "/../swisseph_files");

app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("Ephemerides express server /");
});

app.get("/position", getPosition);

app.get("/houses", gethouses);

app.listen(port, () => {
  console.log(`[Ephemerides]: Server is running at http://localhost:${port}`);
});
