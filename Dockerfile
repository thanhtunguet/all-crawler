FROM node:20-alpine AS final

WORKDIR /app

COPY . .

EXPOSE 3000
ENV NODE_ENV=production
CMD [ "node", "dist/src/main" ]
