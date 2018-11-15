#!/bin/bash -e

# kafka connect
CMD="kafka-consumer-groups --bootstrap-server kafka-1:9091 --execute --reset-offsets --group connect-enkryptio-mongo-sink --to-earliest --all-topics"
echo "COMMAND: $CMD"
docker-compose exec kafka-1 sh -c "$CMD"
