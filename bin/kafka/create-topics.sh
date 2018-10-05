#!/bin/bash -e

# blocks
CMD="kafka-topics --create --zookeeper zookeeper:2181 --replication-factor 1 --partitions 1 --topic blocks --config retention.ms=-1 --config cleanup.policy=compact"
echo "COMMAND: $CMD"
docker-compose exec kafka sh -c "$CMD"

# account-state
CMD="kafka-topics --create --zookeeper zookeeper:2181 --replication-factor 1 --partitions 10 --topic account-state --config retention.ms=-1 --config cleanup.policy=compact"
echo "COMMAND: $CMD"
docker-compose exec kafka sh -c "$CMD"

# pending transactions
CMD="kafka-topics --create --zookeeper zookeeper:2181 --replication-factor 1 --partitions 10 --topic pending-transactions --config retention.ms=-1 --config cleanup.policy=compact"
echo "COMMAND: $CMD"
docker-compose exec kafka sh -c "$CMD"

# metadata
CMD="kafka-topics --create --zookeeper zookeeper:2181 --replication-factor 1 --partitions 1 --topic metadata --config retention.ms=-1 --config cleanup.policy=compact"
echo "COMMAND: $CMD"
docker-compose exec kafka sh -c "$CMD"
