FROM node:9.11.1-alpine

# Add repositories
RUN echo -e "http://uk.alpinelinux.org/alpine/v3.5/main\nhttp://uk.alpinelinux.org/alpine/v3.5/community" > /etc/apk/repositories

# Install deps
RUN apk add --no-cache make gcc musl-dev linux-headers git python g++

# Create workdir
RUN mkdir -p /var/ethvm
WORKDIR /var/ethvm

# Copy
COPY . .

# Expose
EXPOSE 8080
CMD yarn install && yarn start:dev
