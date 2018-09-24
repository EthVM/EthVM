#!/bin/bash -e

CMD="kafka-streams-application-reset --zookeeper zookeeper:2181 --bootstrap-servers kafka:9092 --application-id blocks-processor --input-topics blocks,blocks-info"
echo "COMMAND: $CMD"
docker-compose exec kafka sh -c "$CMD"

CMD="kafka-streams-application-reset --zookeeper zookeeper:2181 --bootstrap-servers kafka:9092 --application-id account-state-processor --input-topics account-state"
echo "COMMAND: $CMD"
docker-compose exec kafka sh -c "$CMD"

CMD="kafka-streams-application-reset --zookeeper zookeeper:2181 --bootstrap-servers kafka:9092 --application-id transactions-processor --input-topics transactions"
echo "COMMAND: $CMD"
docker-compose exec kafka sh -c "$CMD"
