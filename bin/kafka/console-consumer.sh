#!/bin/bash -e

CMD="kafka-console-consumer --bootstrap-server kafka-1:9091 $@"

echo "COMMAND: $CMD"
docker-compose exec kafka-1 sh -c "${CMD}"

