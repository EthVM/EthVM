FROM node:10.14.2-alpine AS build

ARG TARGET=development

ENV WORKDIR /usr/src/app

WORKDIR ${WORKDIR}

COPY ./common ${WORKDIR}/common
COPY ./explorer ${WORKDIR}/explorer

RUN apk add --no-cache bash make gcc musl-dev linux-headers git python g++ \
    && cd ${WORKDIR}/common \
    && yarn install \
    && cd ${WORKDIR}/explorer \
    && yarn install \
    && yarn build:${TARGET}

#
FROM nginx:1.15.8-alpine

WORKDIR /var/www/html

COPY --from=build /usr/src/app/explorer/dist .
COPY ./explorer/nginx/nginx.conf /etc/nginx/conf.d/default.conf

