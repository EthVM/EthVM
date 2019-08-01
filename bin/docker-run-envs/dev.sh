#!/usr/bin/env bash

section "Building utility docker images..."
${SCRIPT_DIR}/docker-build.sh build ethvm-utils
${SCRIPT_DIR}/docker-build.sh build migrator

if [[ $PARITY_ENABLED == "true" ]]; then
  [[ $PARITY_ENABLE_BIND_MOUNTPOINT == "true" ]] && section "Ensuring parity docker mount point exists..." && mkdir -p $PARITY_BIND_MOUNTPOINT
fi

section "Starting up docker containers..."
docker-compose up -d --build

section "Initialising principal db..."
INDEXES_AND_TRIGGERS=${PARITY_INSTA_MINING} ${SCRIPT_DIR}/migrator.sh principal migrate

section "Initialising metrics db..."
INDEXES_AND_TRIGGERS=${PARITY_INSTA_MINING} ${SCRIPT_DIR}/migrator.sh metrics migrate

if [[ $KAFKA_ENABLED == "true" ]]; then
  section "Building avro models..."
  ${SCRIPT_DIR}/avro.sh build

  section "Initialising kafka..."
  ${SCRIPT_DIR}/ethvm-utils.sh kafka init

  section "Building kafka connect connector..."
  ${SCRIPT_DIR}/kafka-connect.sh build-connector

  section "Registering sinks and sources into kafka connect..."
  ${SCRIPT_DIR}/ethvm-utils.sh kafka-connect init
fi
