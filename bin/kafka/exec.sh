#!/usr/bin/env bash

UTIL=${1}
shift

CMD="$@"

docker-compose exec kafka sh -c "kafka-${UTIL} ${@}"

