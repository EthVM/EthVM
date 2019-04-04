FROM node:10.15.3-alpine

ENV WORKDIR /var/www/api

RUN apk --no-cache add bash ca-certificates git

RUN apk add --no-cache --virtual bash

WORKDIR ${WORKDIR}

COPY . ${WORKDIR}/

RUN yarn install

EXPOSE 3000

CMD yarn start
