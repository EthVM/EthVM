#!/usr/bin/env bash

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
ROOT_DIR=$(cd ${SCRIPT_DIR}/..; pwd)

echo "Building API docker image..."
ROOT_DIR/bin/docker-build.sh build api

echo "Building Explorer docker image..."
ROOT_DIR/bin/docker-build.sh build explorer
