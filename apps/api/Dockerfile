FROM node:10.15.3-alpine

ENV WORKDIR /var/www/api

RUN apk --no-cache add bash ca-certificates git make gcc g++ python postgresql-dev

RUN apk add --no-cache --virtual bash

WORKDIR ${WORKDIR}

COPY . ${WORKDIR}/

RUN yarn install

EXPOSE 3000

USER node

CMD yarn start
