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
  gcc zlib-dev \
  libc-dev \
  bsd-compat-headers \
  py-setuptools \
  bash

# Create workdir
RUN mkdir -p /var/ethvm-server
WORKDIR /var/ethvm-server

# Copy
COPY . .

# Install
RUN yarn install

# Expose
EXPOSE 3000
CMD yarn start
