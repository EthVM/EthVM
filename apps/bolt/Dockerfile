FROM zenika/kotlin:1.3.10-jdk11-slim as builder

# Create workdir
RUN mkdir -p /tmp/bolt
WORKDIR /tmp/bolt

# Install deps
RUN apt update && \
  apt install -y wget && \
  apt clean && \
  apt autoremove

# Download dumb-init
RUN wget -O /dumb-init https://github.com/Yelp/dumb-init/releases/download/v1.2.2/dumb-init_1.2.2_amd64

# Copy
COPY . .

# Give execution perms && and build
RUN chmod +x /tmp/bolt/gradlew && \
  /tmp/bolt/gradlew --no-daemon build

FROM zenika/kotlin:1.3.10-jdk11-slim

COPY --from=builder /tmp/bolt/build/distributions/bolt.tar /
COPY --from=builder /dumb-init /usr/bin/dumb-init

# Prepare binary
RUN tar -xvf bolt.tar && \
  mv bolt /usr/bin/bolt && \
  chmod +x /usr/bin/bolt/bin/bolt && \
  chmod +x /usr/bin/dumb-init && \
  rm -rf bolt.tar

# Define entry
ENTRYPOINT ["/usr/bin/dumb-init", "--"]

# Define cmd
CMD ["/usr/bin/bolt/bin/bolt"]
