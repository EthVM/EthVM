FROM alpine:3.8

ENV KAFKA_REGISTRY_URL=http://kafka-schema-registry:8081
ENV KAFKA_CONNECT_URL=http://kafka-connect.ethvm.lan:8083

ENV CONNECTOR=io.enkrypt.kafka.connect.MongoSinkConnector
ENV TOPICS=block-summaries,contract-creations,contract-suicides,fungible-token-balances,non-fungible-token-balances,block-statistics,pending-transactions
ENV MONGODB_URL=mongodb://mongodb:27017/ethvm_local?w=1&journal=true

RUN apk update \
  && apk add jq curl \
  && rm -rf /var/cache/apk/*

COPY retry.sh /usr/bin/retry.sh
RUN chmod +x /usr/bin/retry.sh

COPY init.sh /usr/bin/init.sh
RUN chmod +x /usr/bin/init.sh

COPY sink.json /sink.json

CMD [ "init.sh" ]
