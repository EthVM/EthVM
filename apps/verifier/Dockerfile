FROM node:10.12-alpine

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

# Copy
USER node
WORKDIR /usr/src/app

COPY . .

CMD ["yarn", "start", "--help"]
