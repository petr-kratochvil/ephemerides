# Ephemerides

Express API wrapping the [Swiss Ephemeris](https://www.astro.com/swisseph/) library — planetary body positions, house cusps/chart points, and transit aspects.

Frontend app (React/Vite) consuming this API: [https://github.com/petr-kratochvil/astro1](https://github.com/petr-kratochvil/astro1).

## API

Endpoints:

- `POST /position`: main celestial body objects position for a given timestamp
- `POST /houses`: house cusps and chart points position for a given timestamp and geographical coordinates
- `POST /transits`: list of transits for a given base (natal) timestamp, base (natal) coordinates and transit timestamp

Full request/response shapes are in [`openapi.yaml`](./openapi.yaml).

### Why POST for data fetching

All calculation endpoints use POST methods with JSON payloads instead of standard GET with query parameters. 

This is a tradeoff between HTTP caching and security:
1. Privacy & Security: Birth dates and geographical coordinates are sensitive personal data. Using GET would expose them in plaintext into browser history, CDN logs, and server access logs. POST bodies are encrypted end-to-end via HTTPS.
2. Caching Strategy: While this bypasses default caching mechanisms, the application is designed to scale horizontally by implementing a custom application-level cache (e.g., Redis).

## How to run

### Run locally (Node)

```bash
npm install
npm run dev     # tsx + nodemon, watches src/
```

Server listens on `http://localhost:3601` (override with `PORT`).

### Run with Docker

```bash
npm run docker:build
npm run docker:run
```

The API is now available at `http://localhost:3601`.

### Vercel deployment

Deployed on Vercel via `api/index.ts` (see `vercel.json`); the same Express app also runs standalone from `src/index.ts` for local dev and Docker.

## `sweph` npm package

The [sweph](https://www.npmjs.com/package/sweph) npm package is compiled using [node-gyp](https://www.npmjs.com/package/node-gyp) during package instalL, so the actual package in `node_modules` is platform-dependent and not portable.

## License

AGPL-3.0-or-later — see [`LICENSE`](./LICENSE).

This project links the [Swiss Ephemeris](https://www.astro.com/swisseph/) library, which Astrodienst dual-licenses under AGPL or a paid Professional license. Since this project doesn't hold a Professional license, it (and any public deployment of it) must be licensed under AGPL to comply with that requirement.
