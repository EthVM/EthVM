#!/bin/bash -e

CMD="kafka-avro-console-consumer --bootstrap-server kafka-1:9091 $@"

echo "COMMAND: $CMD"
docker-compose exec kafka-schema-registry sh -c "${CMD}"

