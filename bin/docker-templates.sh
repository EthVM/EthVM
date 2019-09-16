#!/usr/bin/env bash

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# import utils
source ${SCRIPT_DIR}/env.sh

# verify we have required utilities installed
ensure

run() {
  local template="${1:-''}"
  shift

  docker run \
    --rm \
    --user "$(echo $UID)" \
    --mount type=bind,source="${ROOT_DIR}/docker/templer/",target=/templer \
    ethvm/docker-templer:1.1.0 -f /templer/${template}.yaml
}

run "$@"
