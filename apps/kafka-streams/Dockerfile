FROM zenika/kotlin:1.3.10-jdk11-slim as builder

# Create workdir
RUN mkdir -p /tmp/kafka-streams
WORKDIR /tmp/kafka-streams

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
RUN chmod +x /tmp/kafka-streams/gradlew && \
  /tmp/kafka-streams/gradlew --no-daemon build

FROM zenika/kotlin:1.3.10-jdk11-slim

COPY --from=builder /tmp/kafka-streams/build/distributions/kafka-streams.tar /
COPY --from=builder /dumb-init /usr/bin/dumb-init

# Prepare binary
RUN tar -xvf kafka-streams.tar && \
  mv kafka-streams /usr/bin/kafka-streams && \
  chmod +x /usr/bin/kafka-streams/bin/kafka-streams && \
  chmod +x /usr/bin/dumb-init && \
  rm -rf kafka-streams.tar

# Define entry
ENTRYPOINT ["/usr/bin/dumb-init", "--"]

# Define cmd
CMD ["/usr/bin/kafka-streams/bin/kafka-streams"]
