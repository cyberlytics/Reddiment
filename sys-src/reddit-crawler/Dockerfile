# development step

FROM node:18-alpine as base

WORKDIR /home/node/app

COPY package*.json ./

USER node

RUN npm i

COPY . .

# production step

FROM base as production

ENV NODE_PATH = ./build

ENV PORT = 3000

RUN npm run build