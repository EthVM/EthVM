FROM node:10.13.0-slim

# Install deps
RUN apt-get update && \
    apt-get install -y git python make gcc g++

# Create workdir
RUN mkdir -p /var/www
WORKDIR /var/www

# Copy
COPY explorer/ explorer/
COPY common/ common/

# Instal & build
RUN cd explorer/ && \
  yarn install && \
  yarn build && \
  cd .. && \
  rm -rf common

WORKDIR /var/www/explorer

# Expose
EXPOSE 8080
CMD yarn start:prod
