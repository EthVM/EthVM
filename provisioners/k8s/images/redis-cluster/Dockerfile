FROM redis:4.0.10-alpine

# Install dependencies
RUN apk add --no-cache \
  ca-certificates \
  ruby \
  ruby-bundler \
  ruby-dev \
  ruby-rdoc \
  ruby-irb

# Install libraries
RUN gem install redis

# Download redis-trib and install
RUN wget http://download.redis.io/redis-stable/src/redis-trib.rb && \
    mv redis-trib.rb /usr/bin/redis-trib && \
    chmod 777 /usr/bin/redis-trib

# Expose
CMD redis-server
