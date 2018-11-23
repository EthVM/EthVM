#!/usr/bin/env bash

set -o errexit \
    -o pipefail \
    -o nounset

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
ROOT_DIR=$(cd ${SCRIPT_DIR}/..; pwd)

echo "${DOCKER_PASSWORD}" | docker login -u "${DOCKER_USERNAME}" --password-stdin

$ROOT_DIR/bin/docker-build.sh build api
$ROOT_DIR/bin/docker-build.sh push api

$ROOT_DIR/bin/docker-build.sh build explorer
$ROOT_DIR/bin/docker-build.sh push explorer

$ROOT_DIR/bin/docker-build.sh build kafka-connect
$ROOT_DIR/bin/docker-build.sh push kafka-connect

$ROOT_DIR/bin/docker-build.sh build mongodb-install
$ROOT_DIR/bin/docker-build.sh push mongodb-install

$ROOT_DIR/bin/docker-build.sh build zookeeper
$ROOT_DIR/bin/docker-build.sh push zookeeper
