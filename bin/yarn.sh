#!/bin/bash -e

CONTAINER=${1}
shift

CMD="yarn $@"

docker-compose exec ${CONTAINER} sh -c "${CMD}"

