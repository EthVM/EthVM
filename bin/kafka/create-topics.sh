#!/bin/bash -e

# raw-blocks
CMD="kafka-topics --create --zookeeper zookeeper:2181 --replication-factor 1 --partitions 1 --topic raw-blocks"
echo "COMMAND: $CMD"
docker-compose exec kafka sh -c "$CMD"

# raw-blocks retention
CMD="kafka-configs --alter --zookeeper zookeeper:2181 --entity-type topics --entity-name raw-blocks --add-config retention.ms=-1"
echo "COMMAND: $CMD"
docker-compose exec kafka sh -c "$CMD"

# pending transactions
CMD="kafka-topics --create --zookeeper zookeeper:2181 --replication-factor 1 --partitions 100 --topic raw-pending-txs"
echo "COMMAND: $CMD"
docker-compose exec kafka sh -c "$CMD"

# processed blocks
CMD="kafka-topics --create --zookeeper zookeeper:2181 --replication-factor 1 --partitions 1 --topic blocks"
echo "COMMAND: $CMD"
docker-compose exec kafka sh -c "$CMD"

# raw-blocks retention
CMD="kafka-configs --alter --zookeeper zookeeper:2181 --entity-type topics --entity-name blocks --add-config retention.ms=300000"
echo "COMMAND: $CMD"
docker-compose exec kafka sh -c "$CMD"
