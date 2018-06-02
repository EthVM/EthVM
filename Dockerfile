FROM node:9.11.1-alpine

# Install deps
RUN apk add --no-cache make gcc musl-dev linux-headers git python g++

# Create workdir
RUN mkdir -p /var/ethvm
WORKDIR /var/ethvm

# Copy
COPY . .

# Install
RUN npm install

# ENV Variables
ENV ETHVM_HOST='localhost'
ENV ETHVM_PORT='3000'

# Expose
EXPOSE 3000
ENTRYPOINT ["npm", "start"]
