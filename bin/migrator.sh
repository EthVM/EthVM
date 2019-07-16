#!/usr/bin/env bash

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# source env to get platform specific docker compose command
source ${SCRIPT_DIR}/env.sh

# verify we have required utilities installed
ensure

version=$(read_version migrator)

DB=${1}
INDEXES_AND_TRIGGERS=${INDEXES_AND_TRIGGERS:-false}
NETWORK=${NETWORK:-ethvm_net}

shift 1

case ${INDEXES_AND_TRIGGERS} in

  true)
    FLYWAY_REPEATABLE_SQL_MIGRATION_PREFIX="R"
    ;;

  false)
    # Causes flyway to ignore our index and trigger migrations
    FLYWAY_REPEATABLE_SQL_MIGRATION_PREFIX="RR"
    ;;

  *)
    echo "INDEXES_AND_TRIGGERS option not recognized: ${INDEXES_AND_TRIGGERS}. Must be one of: true, false"
    exit 1
    ;;

esac

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

docker run --rm \
  --network ${NETWORK} \
  -e FLYWAY_URL=${FLYWAY_URL} \
  -e FLYWAY_LOCATIONS=${FLYWAY_LOCATIONS} \
  -e FLYWAY_REPEATABLE_SQL_MIGRATION_PREFIX=${FLYWAY_REPEATABLE_SQL_MIGRATION_PREFIX} \
  ethvm/migrator:${version} "$@"
