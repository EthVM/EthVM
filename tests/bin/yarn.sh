#!/usr/bin/env bash

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
SRC_DIR="$(cd $SCRIPT_DIR/.. && pwd)"

CMD="yarn $@"

docker run --rm \
  --volume "${SRC_DIR}":/usr/src/app \
  --network host \
  --workdir /usr/src/app \
  --user $(id -u):$(id -g) \
  node:10 sh -c "${CMD}"
