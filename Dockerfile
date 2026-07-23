FROM node:lts-alpine

RUN apk add python3 build-base

RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app

WORKDIR /home/node/app

COPY package*.json ./

USER node

RUN npm ci

FROM node:lts-alpine

RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app

WORKDIR /home/node/app

COPY --from=0 /home/node/app/node_modules /home/node/app/node_modules

COPY --chown=node:node build/ .

COPY --chown=node:node swisseph_files/ ../swisseph_files

ENV PORT="3601"

EXPOSE $PORT

CMD [ "node", "index.js" ]