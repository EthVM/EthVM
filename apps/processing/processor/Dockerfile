FROM zenika/kotlin:1.3.10-jdk8-slim as builder

# Create workdir
RUN mkdir -p /tmp
WORKDIR /tmp

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
RUN chmod +x /tmp/gradlew && \
  /tmp/gradlew --no-daemon :processor:assemble

FROM zenika/kotlin:1.3.10-jdk8-slim

COPY --from=builder /tmp/processor/build/distributions/processor.tar /
COPY --from=builder /dumb-init /usr/bin/dumb-init

# Prepare binary
RUN tar -xvf processor.tar && \
  mv processor /usr/bin/processor && \
  chmod +x /usr/bin/processor/bin/processor && \
  chmod +x /usr/bin/dumb-init && \
  rm -rf processor.tar

VOLUME ["/var/lib/processor"]

# Define entry
ENTRYPOINT ["/usr/bin/dumb-init", "--"]

# Define cmd
CMD ["/usr/bin/processor/bin/processor", "process"]
