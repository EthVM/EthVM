#!/bin/bash -e

# raw-blocks
CMD="kafka-topics --create --zookeeper zookeeper:2181 --replication-factor 1 --partitions 1 --topic raw-blocks --config retention.ms=-1"
echo "COMMAND: $CMD"
docker-compose exec kafka sh -c "$CMD"

CMD="kafka-topics --create --zookeeper zookeeper:2181 --replication-factor 1 --partitions 1 --topic latest-blocks --config retention.ms=10800000"
echo "COMMAND: $CMD"
docker-compose exec kafka sh -c "$CMD"

CMD="kafka-topics --create --zookeeper zookeeper:2181 --replication-factor 1 --partitions 100 --topic contracts --config cleanup.policy=compact"
echo "COMMAND: $CMD"
docker-compose exec kafka sh -c "$CMD"

CMD="kafka-topics --create --zookeeper zookeeper:2181 --replication-factor 1 --partitions 100 --topic balances --config cleanup.policy=compact"
echo "COMMAND: $CMD"
docker-compose exec kafka sh -c "$CMD"

# pending transactions
CMD="kafka-topics --create --zookeeper zookeeper:2181 --replication-factor 1 --partitions 100 --topic raw-pending-txs"
echo "COMMAND: $CMD"
docker-compose exec kafka sh -c "$CMD"
