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

RUN export PORT="3601"

RUN ls -la /home/node
RUN ls -la /home/node/app
RUN ls -la /home/node/app/api

EXPOSE $PORT

CMD [ "node", "index.js" ]