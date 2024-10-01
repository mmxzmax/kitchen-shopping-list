FROM node:20.17.0-alpine

WORKDIR /app
COPY  /app/dist/apps/kitchen-list-backend .
COPY  /app/node_modules ./node_modules

CMD ["node", "main.js"]