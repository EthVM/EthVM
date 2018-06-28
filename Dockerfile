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
RUN npm run build

# Expose
EXPOSE 80
ENTRYPOINT ["npm", "run", "dist:docker"]
