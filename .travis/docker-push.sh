#!/usr/bin/env bash

# Give script sane defaults
set -o errexit
set -o pipefail
set -o nounset

# Useful VARS
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
ROOT_DIR=$(cd ${SCRIPT_DIR}/..; pwd)

run() {
  echo "${DOCKER_PASSWORD}" | docker login -u "${DOCKER_USERNAME}" --password-stdin

  ${ROOT_DIR}/bin/docker-build.sh build all
  ${ROOT_DIR}/bin/docker-build.sh push all
}
run
