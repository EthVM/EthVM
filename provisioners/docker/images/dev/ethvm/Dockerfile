FROM node:9.11.1-alpine

# Add repositories
RUN echo -e "http://uk.alpinelinux.org/alpine/v3.5/main\nhttp://uk.alpinelinux.org/alpine/v3.5/community" > /etc/apk/repositories

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
RUN mkdir -p /var/ethvm
WORKDIR /var/ethvm

# Copy
COPY . .

# Expose
EXPOSE 8080
CMD yarn install && yarn start:dev
