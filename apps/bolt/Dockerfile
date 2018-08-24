FROM zenika/alpine-kotlin:1.2.40-jdk8 as builder

# Create workdir
RUN mkdir -p /var/bolt
WORKDIR /var/bolt

# Copy
COPY . .

# Create jar
RUN kotlinc /var/bolt/src/main/kotlin/io/enkrypt/bolt/Main.kt -include-runtime -d bolt.jar

FROM zenika/alpine-kotlin:1.2.40-jdk8

COPY --from=builder /var/bolt/bolt.jar /usr/local/bin/

RUN chmod +x /usr/local/bin/bolt.jar

# Expose
CMD ["java -jar bolt.jar"]
