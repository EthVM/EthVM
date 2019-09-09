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

ENV DOCKERIZE_VERSION v0.6.1
ENV PORT 80

WORKDIR /var/www/html

RUN apk add --no-cache- openssl \
    && wget https://github.com/jwilder/dockerize/releases/download/$DOCKERIZE_VERSION/dockerize-alpine-linux-amd64-$DOCKERIZE_VERSION.tar.gz \
    && tar -C /usr/local/bin -xzvf dockerize-alpine-linux-amd64-$DOCKERIZE_VERSION.tar.gz \
    && rm dockerize-alpine-linux-amd64-$DOCKERIZE_VERSION.tar.gz

COPY --from=build /usr/src/app/explorer/dist .
COPY ${WORKDIR}/nginx/nginx.conf /etc/nginx/conf.d/default.conf

ENTRYPOINT [ \
  "dockerize", \
  "-template", \
  "/etc/nginx/conf.d/default.conf:/etc/nginx/conf.d/default.conf" \
]

CMD ["nginx", "-g", "daemon off;"]
