#!/usr/bin/env bash

section "Building utility docker images..."
${SCRIPT_DIR}/docker-build.sh build ethvm-utils
${SCRIPT_DIR}/docker-build.sh build migrator

section "Starting up containers..."
docker-compose up -d --build

# Give time to breathe
sleep 10

section "Checking current dataset..."
mkdir -p ${ROOT_DIR}/datasets

set +o errexit

DATASETS=("principal-${BRANCH}.sql.gz" "metrics-${BRANCH}.sql.gz")

for DATASET in "${DATASETS[@]}"; do

  [[ -f ${ROOT_DIR}/datasets/${DATASET} ]] && (curl -o ${ROOT_DIR}/datasets/${DATASET}.md5 https://ethvm.s3.amazonaws.com/datasets/${DATASET}.md5 --silent 2>/dev/null && cd ${ROOT_DIR}/datasets/ && md5sum --check ${DATASET}.md5 &>/dev/null)
  [[ $? -ne 0 ]] && (info "Downloading dataset $DATASET..." && curl -o ${ROOT_DIR}/datasets/${DATASET} https://ethvm.s3.amazonaws.com/datasets/${DATASET} --progress-bar) || info "You're using latest dataset version! \n"

done

set -o errexit

section "Importing principal dataset..."
gunzip <${ROOT_DIR}/datasets/${DATASETS[0]} | docker-compose exec -T db-principal psql --quiet --username "${PRINCIPAL_USER}" "${PRINCIPAL_DB}"

section "Importing metrics dataset..."
docker-compose exec -T db-metrics psql --username "${METRICS_USER}" "${METRICS_DB}" --quiet -c "ALTER DATABASE "${METRICS_DB}" SET timescaledb.restoring='on';"
gunzip <${ROOT_DIR}/datasets/${DATASETS[1]} | docker-compose exec -T db-metrics psql --quiet --username "${METRICS_USER}" "${METRICS_DB}"
docker-compose exec -T db-metrics psql --username "${METRICS_USER}" "${METRICS_DB}" --quiet -c "ALTER DATABASE "${METRICS_DB}" SET timescaledb.restoring='off';"
