FROM zenika/alpine-kotlin:1.2.40-jdk8 as builder

# Create workdir
RUN mkdir -p /var/bolt
WORKDIR /var/bolt

# Copy
COPY . .

# Give execution perms
RUN chmod +x ./gradlew

# Create binary
RUN ./gradlew --no-daemon build

# Extract & clean
RUN tar -xvf build/distributions/bolt.tar

# Move to parent
RUN mv bolt /bolt

# Add execution permission
RUN chmod +x /bolt/bin/bolt

# Clean leftovers
RUN ./gradlew --no-daemon clean

# # Expose
CMD ["/bolt/bin/bolt"]
