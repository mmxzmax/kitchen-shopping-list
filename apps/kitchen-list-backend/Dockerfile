FROM node:20.17.0-alpine

WORKDIR /app
COPY  ./dist/apps/kitchen-list-backend .

RUN npm ci

CMD ["node", "main.js"]