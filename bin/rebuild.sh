#!/bin/bash -e

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# rebuild containers
${SCRIPT_DIR}/down.sh
${SCRIPT_DIR}/up.sh
