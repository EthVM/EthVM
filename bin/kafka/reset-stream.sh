#!/bin/bash -e

# blocks
CMD="kafka-streams-application-reset --zookeeper zookeeper:2181 --bootstrap-servers kafka-1:9091 --application-id blocks-processor --input-topics blocks"
echo "COMMAND: $CMD"
docker-compose exec kafka-1 sh -c "$CMD"

# charts
CMD="kafka-streams-application-reset --zookeeper zookeeper:2181 --bootstrap-servers kafka-1:9091 --application-id charts-processor --input-topics blocks"
echo "COMMAND: $CMD"
docker-compose exec kafka-1 sh -c "$CMD"

# account-state
CMD="kafka-streams-application-reset --zookeeper zookeeper:2181 --bootstrap-servers kafka-1:9091 --application-id account-state-processor --input-topics account-state"
echo "COMMAND: $CMD"
docker-compose exec kafka-1 sh -c "$CMD"

# pending transactions
CMD="kafka-streams-application-reset --zookeeper zookeeper:2181 --bootstrap-servers kafka-1:9091 --application-id pending-transactions-processor --input-topics pending-transactions"
echo "COMMAND: $CMD"
docker-compose exec kafka-1 sh -c "$CMD"
