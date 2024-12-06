FROM node:22 AS build

COPY package.json yarn.lock .

RUN yarn install

COPY src .

RUN yarn build

FROM node:22-alpine

COPY --from=build dist/* node_modules package.json yarn.lock .

ENTRYPOINT yarn 

