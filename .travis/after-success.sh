#!/usr/bin/env bash

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
ROOT_DIR=$(cd ${SCRIPT_DIR}/..; pwd)

main() {
  echo "Login to Docker Hub..."
  docker login -u ${DOCKER_USER} -p ${DOCKER_PASSWORD}

  echo "Building API docker image..."
  ROOT_DIR/bin/docker-build.sh build api

  echo "Pushing API docker image to repository..."
  ROOT_DIR/bin/docker-build.sh push api

  echo "Building explorer docker image..."
  ROOT_DIR/bin/docker-build.sh build explorer development-ci

  echo "Pushing explorer docker image to repository..."
  ROOT_DIR/bin/docker-build.sh push explorer development-ci
}

main
