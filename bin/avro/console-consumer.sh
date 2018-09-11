#!/bin/bash -e

CMD="kafka-avro-console-consumer --bootstrap-server kafka:9092 $@"

echo "COMMAND: $CMD"
docker-compose exec kafka-schema-registry sh -c "${CMD}"

