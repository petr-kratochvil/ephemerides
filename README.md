# Ephemerides

Express API wrapping the [Swiss Ephemeris](https://www.astro.com/swisseph/) library — planetary body positions, house cusps/chart points, and transit aspects.

Endpoints: `POST /position`, `POST /houses`, `POST /transits`. Full request/response shapes are in [`openapi.yaml`](./openapi.yaml).

Deployed on Vercel via `api/index.ts` (see `vercel.json`); the same Express app also runs standalone from `src/index.ts` for local dev and Docker.

## Run locally (Node)

```bash
npm install
npm run dev     # ts-node + nodemon, watches src/
```

Server listens on `http://localhost:3601` (override with `PORT`).

## Run with Docker

```bash
npm run docker:build
npm run docker:run
```

The API is now available at `http://localhost:3601`.

## `sweph` npm package

The [sweph](https://www.npmjs.com/package/sweph) npm package is compiled using [node-gyp](https://www.npmjs.com/package/node-gyp) during package instalL, so the actual package in `node_modules` is platform-dependent and not portable.