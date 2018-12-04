FROM confluentinc/cp-kafka

ENV ZOOKEEPER=zookeeper:2181
ENV KAFKA_CUB_TIMEOUT=300
ENV KAFKA_BROKERS=3

COPY create-topics.sh /usr/bin
RUN chmod +x /usr/bin/create-topics.sh

COPY reset-topics.sh /usr/bin
RUN chmod +x /usr/bin/reset-topics.sh

CMD ["create-topics.sh"]
