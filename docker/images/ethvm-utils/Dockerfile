FROM alpine:3.9

ENV KAFKA_VERSION 2.2.0
ENV SCALA_VERSION 2.12
ENV DOCKERIZE_VERSION v0.6.1

ENV CP_VERSION 5.1.0
ENV KAFKA_ZOOKEEPER_CONNECT zookeeper:2181
ENV KAFKA_BOOTSTRAP_SERVERS kafka:9092
ENV KAFKA_SCHEMA_REGISTRY http://kafka-schema-registry:8081
ENV KAFKA_CONNECT_URL http://kafka-connect:8083
ENV MONGO_URL mongodb://mongo/ethvm_local
ENV PARITY_WS_URL ws://parity:8546

LABEL name="kafka" version=${KAFKA_VERSION}
LABEL name="mongodb" version="4.0.5-r0"

RUN apk add --no-cache openjdk8-jre bash coreutils su-exec mongodb openssl jq curl

# Install dockerize

RUN wget https://github.com/jwilder/dockerize/releases/download/$DOCKERIZE_VERSION/dockerize-alpine-linux-amd64-$DOCKERIZE_VERSION.tar.gz \
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

#

COPY opt/ethvm /opt/ethvm

# seutup path

ENV PATH /sbin:/opt/kafka/bin/:/opt/ethvm/bin/:$PATH

ENTRYPOINT [ \
  "dockerize", \
  "-template", "/opt/ethvm/kafka:/opt/ethvm/kafka", \
  "-template", "/opt/ethvm/kafka-connect/sinks:/opt/ethvm/kafka-connect/sinks", \
  "-template", "/opt/ethvm/kafka-connect/sources:/opt/ethvm/kafka-connect/sources", \
  "ethvm-utils.sh" \
]
