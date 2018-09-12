#!/bin/bash -e

CMD="kafka-streams-application-reset --zookeeper zookeeper:2181 --bootstrap-servers kafka:9092 --application-id blocks-processor --input-topics raw-blocks --intermediate-topics rekeyed-topic"
echo "COMMAND: $CMD"
docker-compose exec kafka sh -c "$CMD"
