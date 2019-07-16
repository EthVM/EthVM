FROM alpine:3.9

ENV KAFKA_VERSION 2.1.1
ENV SCALA_VERSION 2.12
ENV DOCKERIZE_VERSION v0.6.1

ENV CP_VERSION 5.2.0
ENV KAFKA_ZOOKEEPER_CONNECT zookeeper:2181
ENV KAFKA_BOOTSTRAP_SERVERS kafka:9092
ENV KAFKA_REPLICATION_FACTOR 1
ENV KAFKA_SCHEMA_REGISTRY_URL http://kafka-schema-registry:8081
ENV KAFKA_CONNECT_URL http://kafka-connect:8083
ENV PARITY_WS_URL ws://parity:8546

LABEL name="kafka" version=${KAFKA_VERSION}

# Install dependencies

RUN apk add --no-cache openjdk8-jre bash coreutils su-exec openssl jq curl git postgresql-client tini && \
    wget https://github.com/jwilder/dockerize/releases/download/$DOCKERIZE_VERSION/dockerize-alpine-linux-amd64-$DOCKERIZE_VERSION.tar.gz \
    && tar -C /usr/local/bin -xzvf dockerize-alpine-linux-amd64-$DOCKERIZE_VERSION.tar.gz \
    && rm dockerize-alpine-linux-amd64-$DOCKERIZE_VERSION.tar.gz

# Install kafka binaries

RUN apk add --no-cache -t .build-deps curl ca-certificates jq \
  && mkdir -p /opt \
  && mirror=$(curl --stderr /dev/null https://www.apache.org/dyn/closer.cgi\?as_json\=1 | jq -r '.preferred') \
  && curl -sSL "${mirror}kafka/${KAFKA_VERSION}/kafka_${SCALA_VERSION}-${KAFKA_VERSION}.tgz" \
  | tar -xzf - -C /opt \
  && mv /opt/kafka_${SCALA_VERSION}-${KAFKA_VERSION} /opt/kafka \
  && rm -rf /tmp/* \
  && apk del --purge .build-deps

COPY opt/ethvm /opt/ethvm

# setup path
ENV PATH /sbin:/opt/kafka/bin/:/opt/ethvm/bin/:$PATH

# copy entrypoint
COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

ENTRYPOINT ["/sbin/tini", "--", "/docker-entrypoint.sh"]
