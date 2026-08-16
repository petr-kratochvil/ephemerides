# builder stage
FROM node:24-alpine AS builder

RUN apk add python3 build-base nodejs-dev

RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app

WORKDIR /home/node/app

COPY --chown=node:node package*.json ./

USER node

RUN --mount=type=cache,id=npm-cache,target=/home/node/.npm,uid=1000,gid=1000 \
npm ci --cache /home/node/.npm

COPY --chown=node:node tsconfig.json ./
COPY --chown=node:node src/ ./src/

RUN npm run build

RUN npm prune --omit=dev

# runner stage
FROM node:24-alpine AS runner

RUN apk add --no-cache tini

RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app

WORKDIR /home/node/app

COPY --from=builder --chown=node:node /home/node/app/node_modules /home/node/app/node_modules
COPY --from=builder --chown=node:node /home/node/app/build/ .
COPY --chown=node:node swisseph_files/ ../swisseph_files

ENV NODE_ENV=production
ENV PORT="3601"
ENV SWISSEPH_PATH="/home/node/swisseph_files"

EXPOSE $PORT

USER node

ENTRYPOINT ["/sbin/tini", "--"]
CMD [ "node", "index.js" ]
