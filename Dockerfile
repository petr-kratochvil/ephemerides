FROM node:24-alpine

RUN apk add python3 build-base nodejs-dev

RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app

WORKDIR /home/node/app

COPY package*.json ./

USER node

RUN --mount=type=cache,id=npm-cache,target=/home/node/.npm,uid=1000,gid=1000 \
npm ci --cache /home/node/.npm

COPY --chown=node:node tsconfig.json ./
COPY --chown=node:node src/ ./src/

RUN npm run build

FROM node:24-alpine

RUN apk add --no-cache tini

RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app

WORKDIR /home/node/app

COPY --from=0 /home/node/app/node_modules /home/node/app/node_modules

COPY --from=0 --chown=node:node /home/node/app/build/ .

COPY --chown=node:node swisseph_files/ ../swisseph_files

ENV PORT="3601"

EXPOSE $PORT

ENTRYPOINT ["/sbin/tini", "--"]
CMD [ "node", "index.js" ]
