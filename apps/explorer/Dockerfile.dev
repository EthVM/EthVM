FROM node:10.15.3-alpine

ENV WORKDIR /var/explorer

RUN apk add --no-cache bash git

WORKDIR ${WORKDIR}

USER node

COPY . ${WORKDIR}

EXPOSE 8080

CMD yarn && yarn start:dev
