FROM confluentinc/cp-kafka

ENV ZOOKEEPER=zookeeper:2181
ENV KAFKA_CUB_TIMEOUT=300
ENV KAFKA_BROKERS=3

COPY create_topics.sh /
RUN chmod +x /create_topics.sh

CMD ["/create_topics.sh"]
