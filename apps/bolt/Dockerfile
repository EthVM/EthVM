FROM zenika/kotlin:1.3.10-jdk11-slim as builder

# Create workdir
RUN mkdir -p /var/bolt
WORKDIR /var/bolt

# Copy
COPY . .

# Give execution perms && and build
RUN chmod +x ./gradlew && \
    ./gradlew --no-daemon build

FROM zenika/kotlin:1.3.10-jdk11-slim

COPY --from=builder /var/bolt/build/distributions/bolt.tar .

# Prepare binary
RUN mkdir /bolt && \
    tar -xvf bolt.tar && \
    mv bolt /usr/bin/bolt && \
    chmod +x /usr/bin/bolt/bin/bolt

# Expose
CMD ["/usr/bin/bolt/bin/bolt"]
