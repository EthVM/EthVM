FROM hseeberger/scala-sbt as builder

ARG KM_VERSION=2.0.0.2

WORKDIR /tmp/kafka-manager-${KM_VERSION}

RUN curl -fsL https://github.com/yahoo/kafka-manager/archive/${KM_VERSION}.tar.gz | tar xfz - -C /tmp && \
  sbt clean dist && \
  unzip ./target/universal/kafka-manager-${KM_VERSION}.zip -d / && \
  mkdir -p /dist && \
  mv /kafka-manager-${KM_VERSION}/* /dist

FROM openjdk:8-jre-alpine

ENV ZK_HOSTS=zookeeper:2181

WORKDIR /kafka-manager

COPY --from=builder /dist .

RUN wget -O /usr/bin/dumb-init https://github.com/Yelp/dumb-init/releases/download/v1.2.2/dumb-init_1.2.2_amd64 && \
  apk add --no-cache bash && \
  chmod +x /usr/bin/dumb-init

EXPOSE 9000

ENTRYPOINT ["/usr/bin/dumb-init", "--"]

CMD ["./bin/kafka-manager", "-Dconfig.file=conf/application.conf"]
