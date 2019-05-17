#!/usr/bin/env bash

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
ROOT_DIR=$(cd ${SCRIPT_DIR}/..; pwd)

main() {
  local id=${1:-}
  local flavor=${2:-}
  shift 2

  if [[ -z "$id" ]] {
    echo "Ignoring docker image build..."
    exit
  }

  echo "Login to Docker Hub..."
  docker login -u ${DOCKER_USER} -p ${DOCKER_PASSWORD}

  echo "Building $id $flavor docker image..."
  ROOT_DIR/bin/docker-build.sh build $id $flavor

  echo "Pushing $id $flavor docker image to repository..."
  ROOT_DIR/bin/docker-build.sh push $id $flavor
}

main "$@"
