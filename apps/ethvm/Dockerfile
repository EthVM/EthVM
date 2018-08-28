FROM node:10.9.0-alpine

# Install deps
RUN apk add --no-cache make gcc musl-dev linux-headers git python g++

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
