#!/bin/bash -e

# blocks
CMD="kafka-streams-application-reset --zookeeper zookeeper:2181 --bootstrap-servers kafka:9092 --application-id blocks-processor --input-topics blocks"
echo "COMMAND: $CMD"
docker-compose exec kafka sh -c "$CMD"

# account-state
CMD="kafka-streams-application-reset --zookeeper zookeeper:2181 --bootstrap-servers kafka:9092 --application-id account-state-processor --input-topics account-state"
echo "COMMAND: $CMD"
docker-compose exec kafka sh -c "$CMD"

# pending transactions
CMD="kafka-streams-application-reset --zookeeper zookeeper:2181 --bootstrap-servers kafka:9092 --application-id pending-transactions-processor --input-topics pending-transactions"
echo "COMMAND: $CMD"
docker-compose exec kafka sh -c "$CMD"
