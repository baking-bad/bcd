FROM node:latest AS base
WORKDIR /better-call-dev
ADD . .
RUN npm i
RUN npm run build


FROM nginx:latest AS release
COPY --from=base /better-call-dev/dist /usr/share/nginx/html/