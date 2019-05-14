FROM node:10.15.3-alpine

ENV WORKDIR /var/www/api

RUN apk --no-cache add bash ca-certificates git make gcc g++ python postgresql-dev

WORKDIR ${WORKDIR}

COPY . ${WORKDIR}/

RUN yarn install

EXPOSE 3000

RUN chown -R node ${WORKDIR}

USER node

CMD yarn start
