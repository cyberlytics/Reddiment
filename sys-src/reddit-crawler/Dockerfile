# development step

FROM node:18-alpine as base

WORKDIR /home/node/app

COPY package*.json ./

USER node

RUN npm i

RUN npm run dev

COPY . .

# production step

FROM base as production

ENV NODE_PATH = ./build

ENV PORT = 4000

RUN npm run build