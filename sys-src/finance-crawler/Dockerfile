
## Dockerfile modified from Backend!


FROM image=node:18-alpine


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



RUN mkdir -p /app/node_modules && chown -R node:node /app
WORKDIR /app
COPY --chown=node:node package*.json ./

USER node
RUN npm install --omit=dev
COPY --from=builder /home/node/app/build ./build


CMD [ "node", "build/src/fetch_data.js" ]