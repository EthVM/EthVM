#!/bin/bash -e

CMD="kafka-consumer-groups --bootstrap-server kafka:9092 --group $@ --describe"
echo "COMMAND: $CMD"
docker-compose exec kafka sh -c "$CMD"
