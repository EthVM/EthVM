#!/bin/bash -e

# blocks
CMD="kafka-topics --create --zookeeper zookeeper:2181 --replication-factor 1 --partitions 1 --topic block-summaries --config retention.ms=-1 --config cleanup.policy=compact"
echo "COMMAND: $CMD"
docker-compose exec kafka-1 sh -c "$CMD"
sleep 2

CMD="kafka-topics --create --zookeeper zookeeper:2181 --replication-factor 1 --partitions 12 --topic block-metrics --config retention.ms=-1 --config cleanup.policy=compact"
echo "COMMAND: $CMD"
docker-compose exec kafka-1 sh -c "$CMD"
sleep 2

CMD="kafka-topics --create --zookeeper zookeeper:2181 --replication-factor 1 --partitions 12 --topic block-statistics --config retention.ms=-1 --config cleanup.policy=compact"
echo "COMMAND: $CMD"
docker-compose exec kafka-1 sh -c "$CMD"
sleep 2

CMD="kafka-topics --create --zookeeper zookeeper:2181 --replication-factor 1 --partitions 12 --topic contract-suicides --config retention.ms=-1 --config cleanup.policy=compact"
echo "COMMAND: $CMD"
docker-compose exec kafka-1 sh -c "$CMD"
sleep 2

CMD="kafka-topics --create --zookeeper zookeeper:2181 --replication-factor 1 --partitions 12 --topic contract-creations --config retention.ms=-1 --config cleanup.policy=compact"
echo "COMMAND: $CMD"
docker-compose exec kafka-1 sh -c "$CMD"
sleep 2

# account-state

CMD="kafka-topics --create --zookeeper zookeeper:2181 --replication-factor 1 --partitions 12 --topic fungible-token-movements --config retention.ms=-1"
echo "COMMAND: $CMD"
docker-compose exec kafka-1 sh -c "$CMD"
sleep 2

CMD="kafka-topics --create --zookeeper zookeeper:2181 --replication-factor 1 --partitions 12 --topic fungible-token-balances --config retention.ms=-1 --config cleanup.policy=compact"
echo "COMMAND: $CMD"
docker-compose exec kafka-1 sh -c "$CMD"
sleep 2

CMD="kafka-topics --create --zookeeper zookeeper:2181 --replication-factor 1 --partitions 12 --topic non-fungible-token-balances --config retention.ms=-1 --config cleanup.policy=compact"
echo "COMMAND: $CMD"
docker-compose exec kafka-1 sh -c "$CMD"
sleep 2

# pending transactions
CMD="kafka-topics --create --zookeeper zookeeper:2181 --replication-factor 1 --partitions 12 --topic pending-transactions --config retention.ms=-1 --config cleanup.policy=compact"
echo "COMMAND: $CMD"
docker-compose exec kafka-1 sh -c "$CMD"
sleep 2

# metadata
CMD="kafka-topics --create --zookeeper zookeeper:2181 --replication-factor 1 --partitions 1 --topic metadata --config retention.ms=-1 --config cleanup.policy=compact"
echo "COMMAND: $CMD"
docker-compose exec kafka-1 sh -c "$CMD"


