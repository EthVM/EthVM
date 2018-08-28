FROM zenika/alpine-kotlin:1.2.40-jdk8 as builder

# Create workdir
RUN mkdir -p /var/bolt
WORKDIR /var/bolt

# Copy
COPY . .

# Give execution perms
RUN chmod +x ./gradlew

# Create jar
RUN ./gradlew build

FROM zenika/alpine-kotlin:1.2.40-jdk8

# Copy to a new machine
COPY --from=builder /var/bolt/build/distributions/bolt.tar /

# Extract
RUN tar -xvf /bolt.tar

# Move resulting folder to execution
RUN mv /bolt/bin/bolt /usr/local/bin
RUN mv /bolt/lib /usr/local/bin

# Give execution permission
RUN chmod +x /usr/local/bin/bolt

# Clean leftovers
RUN rm -rf bolt bolt.tar

# Expose
CMD ["bolt"]
