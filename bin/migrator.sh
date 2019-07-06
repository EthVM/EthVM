#!/usr/bin/env bash

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# source env to get platform specific docker compose command
source ${SCRIPT_DIR}/env.sh

version=$(read_version migrator)

DB=${1}
LOCATION=${2}
NETWORK=${NETWORK:-ethvm_back}

shift 2

case ${DB} in

  principal)
    FLYWAY_URL=${PRINCIPAL_JDBC_URL}
    FLYWAY_LOCATIONS="filesystem:/flyway/migrations/principal"
    ;;

  metrics)
    FLYWAY_URL=${METRICS_JDBC_URL}
    FLYWAY_LOCATIONS="filesystem:/flyway/migrations/metrics"
    ;;

  *)
    echo "DB name not recognized: ${DB}. Must be one of: principal, metrics"
    exit 1
  ;;

esac

case ${LOCATION} in

  all)
    ;;

  initial)
    FLYWAY_LOCATIONS="${FLYWAY_LOCATIONS}/initial"
    ;;

  *)
    echo "LOCATION not recognized: ${LOCATION}. Must be on of: default, indexes, triggers"
    exit 1

esac

docker run --rm \
  --network ${NETWORK} \
  -e FLYWAY_URL=${FLYWAY_URL} \
  -e FLYWAY_LOCATIONS=${FLYWAY_LOCATIONS} \
  ethvm/migrator:${version} "$@"
