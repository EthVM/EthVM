FROM node:9.11.1-alpine

# Install deps
RUN apk add --no-cache make gcc musl-dev linux-headers git python2 g++

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
