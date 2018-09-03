FROM zenika/alpine-kotlin:1.2.40-jdk8 as builder

# Create workdir
RUN mkdir -p /var/bolt
WORKDIR /var/bolt

# Copy
COPY . .

# Give execution perms
RUN chmod +x ./gradlew

# Create jar
RUN ./gradlew --no-daemon build

FROM zenika/alpine-kotlin:1.2.40-jdk8

# Copy to a new machine
COPY --from=builder /var/bolt/build/distributions/bolt.tar /

# Extract
RUN tar -xvf /bolt.tar

# Clean leftovers
RUN rm -rf bolt.tar

# Give execution permission
RUN chmod +x /bolt/bin/bolt

# Expose
CMD ["/bolt/bin/bolt"]
