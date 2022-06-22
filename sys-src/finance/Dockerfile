
## Dockerfile from Backend!

# Define some variables

ARG image=node:18-alpine
ARG port=4000


# Modified from source: https://towardsdev.com/writing-a-docker-file-for-your-node-js-typescript-micro-service-c5170b957893
FROM $image as builder
# The following ARG-lines are needed to pass arguments from "before the FROM-line" to "after the FROM-line"
ARG image
ARG port

# Create folders for node_modules
RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app
WORKDIR /home/node/app

# Copy package*.json files into build-container
COPY --chown=node:node package*.json .
RUN npm config set unsafe-perm true

# Install TypeScript
RUN npm i -g typescript

# Switch to user "node" and install all dependencies
USER node
RUN npm i

# Copy project files
COPY --chown=node:node tsconfig.json .
COPY --chown=node:node src/ .

# Build project
RUN npm run build


#################

FROM $image
# The following ARG-lines are needed to pass arguments from "before the FROM-line" to "after the FROM-line"
ARG image
ARG port

RUN mkdir -p /app/node_modules && chown -R node:node /app
WORKDIR /app
COPY --chown=node:node package*.json ./

USER node
RUN npm install --omit=dev
COPY --from=builder /home/node/app/build ./build

ENV PORT=${port}
EXPOSE $port

CMD [ "node", "build/server.js" ]