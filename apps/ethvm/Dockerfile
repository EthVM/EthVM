FROM node:10.9.0-alpine

# Install deps
RUN apk add --no-cache make gcc musl-dev linux-headers git python g++

# Create workdir
RUN mkdir -p /var/www
WORKDIR /var/www

# Copy
COPY ethvm/ ethvm/
COPY common/ common/

# Instal & build
RUN cd ethvm/ && \
  yarn install && \
  yarn build && \
  cd .. && \
  rm -rf common

WORKDIR /var/www/ethvm

# Expose
EXPOSE 8080
CMD ["yarn start:prod"]
