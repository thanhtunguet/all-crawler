FROM node:20-alpine AS build

WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --development

COPY . .
RUN yarn build

FROM node:20-alpine AS final

WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --production

COPY . .
COPY --from=build /app/dist/ ./

EXPOSE 3000
ENV NODE_ENV=production
CMD [ "node", "dist/src/main" ]
