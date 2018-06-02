FROM node:9.11.1-alpine

# Install deps
RUN apk add --no-cache make gcc musl-dev linux-headers git python g++

# Create workdir
RUN mkdir -p /var/ethvm
WORKDIR /var/ethvm

# Copy
COPY . .

# Install & Build
RUN npm install
RUN npm build

# ENV Variables
ENV ETHVM_HOST='0.0.0.0'
ENV ETHVM_PORT='8080'

# Expose
EXPOSE 8080
ENTRYPOINT ["npm", "start"]
