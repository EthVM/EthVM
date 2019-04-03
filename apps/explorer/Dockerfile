FROM node:10.15.3-alpine AS build

ARG TARGET=development

ENV WORKDIR /usr/src/app/explorer

WORKDIR ${WORKDIR}

COPY . ${WORKDIR}

RUN apk add --no-cache bash git \
    && cd ${WORKDIR} \
    && yarn install \
    && yarn build:${TARGET}

FROM nginx:1.15.8-alpine

WORKDIR /var/www/html

COPY --from=build /usr/src/app/explorer/dist .
COPY ${WORKDIR}/nginx/nginx.conf /etc/nginx/conf.d/default.conf

