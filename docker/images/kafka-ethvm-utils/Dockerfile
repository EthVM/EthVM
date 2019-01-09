FROM confluentinc/cp-kafka

# define env variables
ENV ZOOKEEPER_URL=zookeeper:2181

ENV KAFKA_BOOTSTRAP_URL=kafka-1:9092
ENV KAFKA_CONNECT_URL=http://kafka-connect:8083
ENV KAFKA_CUB_TIMEOUT=300
ENV KAFKA_BROKERS=1
ENV KAFKA_REPLICATION_FACTOR=1

# map /data volume to define custom sinks / sources
VOLUME /data

# copy default sinks / sources
COPY sinks/ /data/sinks
COPY sources/ /data/sources

# Copy main script
COPY kafka-ethvm-utils.sh /usr/bin
RUN chmod +x /usr/bin/kafka-ethvm-utils.sh

# Entry
ENTRYPOINT ["kafka-ethvm-utils.sh"]
