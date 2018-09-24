#!/bin/bash -e

# blocks
CMD="kafka-topics --create --zookeeper zookeeper:2181 --replication-factor 1 --partitions 10 --topic blocks --config retention.ms=-1 --config cleanup.policy=compact"
echo "COMMAND: $CMD"
docker-compose exec kafka sh -c "$CMD"

# block info
CMD="kafka-topics --create --zookeeper zookeeper:2181 --replication-factor 1 --partitions 10 --topic info --config retention.ms=-1"
echo "COMMAND: $CMD"
docker-compose exec kafka sh -c "$CMD"

# state
CMD="kafka-topics --create --zookeeper zookeeper:2181 --replication-factor 1 --partitions 10 --topic account-state --config retention.ms=-1 --config cleanup.policy=compact"
echo "COMMAND: $CMD"
docker-compose exec kafka sh -c "$CMD"

# transactions
CMD="kafka-topics --create --zookeeper zookeeper:2181 --replication-factor 1 --partitions 10 --topic transactions --config retention.ms=-1"
echo "COMMAND: $CMD"
docker-compose exec kafka sh -c "$CMD"

# pending transactions
CMD="kafka-topics --create --zookeeper zookeeper:2181 --replication-factor 1 --partitions 10 --topic pending-transactions --config retention.ms=-1"
echo "COMMAND: $CMD"
docker-compose exec kafka sh -c "$CMD"
