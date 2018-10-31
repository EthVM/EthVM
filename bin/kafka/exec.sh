#!/bin/bash -e

UTIL=${1}
shift

CMD="$@"

docker-compose exec kafka-1 sh -c "kafka-${UTIL} ${@}"

