FROM node:9.11.1-alpine

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

# Instal & build
RUN yarn install
RUN yarn build

# Expose
EXPOSE 8080
CMD ["yarn start"]
