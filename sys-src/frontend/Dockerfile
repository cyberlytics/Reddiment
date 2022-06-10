FROM node:18-alpine AS build-stage

WORKDIR /app

# copy dependencies
COPY package.json package-lock.json ./

# copy graphql assets for codegen
COPY .graphqlrc.yaml ./
COPY ./src/lib/graphql ./src/lib/graphql

# install Node dependencies
RUN npm install

# copy assets
COPY . .

# build application for production
RUN npm run build && npm prune --production

FROM nginx:alpine as production-stage

# replace nginx config
RUN rm -rf /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d

WORKDIR /usr/share/nginx/html

# remove default nginx static assets
RUN rm -rf ./*

# copy static assets from build stage
COPY --from=build-stage /app/build .

# nginx with global directives and daemon off
ENTRYPOINT ["nginx", "-g", "daemon off;"]
