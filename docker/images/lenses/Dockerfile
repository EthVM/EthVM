FROM landoop/lenses:2.3

# Env variables
ENV DOCKERIZE_VERSION v0.6.1

ENV LENSES_IP 0.0.0.0
ENV LENSES_PORT 9991
ENV LENSES_KAFKA_BROKERS PLAINTEXT://kafka-1:9091
ENV LENSES_ZOOKEEPER_HOSTS { url:\"zookeeper-1:2181\", jmx:\"zookeeper-1:9585\" }
ENV LENSES_SCHEMA_REGISTRY_URLS { url:\"http://kafka-schema-registry:8081\", jmx:\"kafka-schema-registry:9587\" }
ENV LENSES_CONNECT_CLUSTER { name: \"ethvm\", urls: [ {url:\"http://kafka-connect:8083\", jmx:\"kafka-connect:9588\"} ], statuses:\"ethvm-storage-topic\", configs:\"ethvm-storage-config\", offsets:\"ethvm-storage-offsets\" }

# Install dockerize

RUN wget https://github.com/jwilder/dockerize/releases/download/$DOCKERIZE_VERSION/dockerize-linux-amd64-$DOCKERIZE_VERSION.tar.gz \
    && tar -C /usr/local/bin -xzvf dockerize-linux-amd64-$DOCKERIZE_VERSION.tar.gz \
    && rm dockerize-linux-amd64-$DOCKERIZE_VERSION.tar.gz

# Copy files
COPY license.json /etc/lenses/license.json
COPY lenses.tmpl.conf /lenses.tmpl.conf

# Modify CMD
CMD ["sh", "-c", "mkdir -p /mnt/settings && dockerize -template /lenses.tmpl.conf:/mnt/settings/lenses.conf && /usr/local/bin/setup.sh"]
