# build step

FROM node:18-alpine as builder

RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app
WORKDIR /home/node/app

COPY --chown=node:node package*.json .
RUN npm config set unsafe-perm true

RUN npm i -g typescript

USER node
RUN npm i

COPY --chown=node:node tsconfig.json .
COPY --chown=node:node src/ .

RUN npm run build

# production step

FROM node:18-alpine as production

RUN mkdir -p /app/node_modules && chown -R node:node /app
WORKDIR /app
COPY --chown=node:node package*.json .

USER node
RUN npm i --omit=dev
COPY --from=builder /home/node/app/build ./build

CMD ["node", "build/crawler.js" ]