#!/bin/bash -e

# blocks
CMD="kafka-streams-application-reset --zookeeper zookeeper:2181 --bootstrap-servers kafka-1:9091 --application-id blocks-processor --input-topics blocks"
echo "COMMAND: $CMD"
docker-compose exec kafka-1 sh -c "$CMD"

# state
CMD="kafka-streams-application-reset --zookeeper zookeeper:2181 --bootstrap-servers kafka-1:9091 --application-id state-processor --input-topics fungible-token-movements block-metrics"
echo "COMMAND: $CMD"
docker-compose exec kafka-1 sh -c "$CMD"
