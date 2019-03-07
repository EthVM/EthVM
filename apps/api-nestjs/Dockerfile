FROM node:10.9.0-alpine

# Install deps
RUN apk --no-cache add \
  bash \
  g++ \
  ca-certificates \
  lz4-dev \
  musl-dev \
  cyrus-sasl-dev \
  openssl-dev \
  make \
  python \
  gcc \
  linux-headers \
  git

RUN apk add --no-cache --virtual \
  .build-deps \
  gcc \
  zlib-dev \
  libc-dev \
  bsd-compat-headers \
  py-setuptools \
  bash

# Create workdir
RUN mkdir -p /var/www
WORKDIR /var/www

# Copy
COPY api-nestjs/ api-nestjs/
COPY common/ common/

# Install
RUN cd api-nestjs && \
  yarn install

WORKDIR /var/www/api-nestjs

# Expose
EXPOSE 3000
CMD yarn start
