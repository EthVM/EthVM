#!/bin/bash -e

CMD="kafka-topics --list --zookeeper zookeeper:2181"
echo "COMMAND: $CMD"
docker-compose exec kafka-1 sh -c "$CMD"
