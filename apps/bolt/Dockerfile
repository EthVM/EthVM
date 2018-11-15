FROM zenika/kotlin:1.3.10-jdk11-slim as builder

# Create workdir
RUN mkdir -p /var/bolt
WORKDIR /var/bolt

# Copy
COPY . .

# Give execution perms
RUN chmod +x ./gradlew

# Create binary
RUN ./gradlew --no-daemon build

FROM zenika/kotlin:1.3.10-jdk11-slim

COPY --from=builder /var/bolt/build/distributions/bolt.tar .

RUN mkdir /bolt

# Extract & clean
RUN tar -xvf bolt.tar

# Move to parent
RUN mv bolt /usr/bin/bolt

# Add execution permission
RUN chmod +x /usr/bin/bolt/bin/bolt

# Expose
ENTRYPOINT ["/usr/bin/bolt/bin/bolt"]
