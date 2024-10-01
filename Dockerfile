FROM node:20.17.0-alpine AS base-builder

WORKDIR /app

COPY . .

FROM node:20.17.0-alpine AS finalnode

WORKDIR /app
COPY --from=base-builder /app/dist/apps/kitchen-list-backend .
COPY --from=base-builder /app/node_modules ./node_modules

CMD ["node", "main.js"]

FROM nginx:alpine AS finalnginx

WORKDIR /usr/share/nginx/html

RUN rm -rf ./*
COPY --from=base-builder /app/dist/apps/kitchen-list-frontend .
RUN ls
COPY ./docker/nginx/conf.conf /etc/nginx/conf.d/default.conf
CMD ["nginx", "-g", "daemon off;"]