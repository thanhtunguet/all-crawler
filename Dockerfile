FROM node:20-alpine as build

WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --development

COPY . .
RUN yarn build

FROM node:20-alpine as final

WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --production

COPY . .
COPY --from=build dist/ ./

EXPOSE 3000
ENV NODE_ENV=production
ENTRYPOINT [ "node", "dist/src/main" ]
