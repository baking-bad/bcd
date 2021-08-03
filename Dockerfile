FROM node:latest AS build
WORKDIR /better-call-dev

COPY package.json yarn.lock ./
RUN yarn

COPY . .
RUN yarn build

FROM nginx:latest AS release
COPY default.conf /etc/nginx/conf.d/default.conf
WORKDIR /usr/share/nginx/html/
COPY --from=build /better-call-dev/dist ./
