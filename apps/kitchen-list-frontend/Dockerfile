FROM nginx:alpine

WORKDIR /usr/share/nginx/html

RUN rm -rf ./*
COPY ./dist/apps/kitchen-list-frontend .
COPY ./docker/nginx/conf.conf /etc/nginx/conf.d/default.conf
CMD ["nginx", "-g", "daemon off;"]