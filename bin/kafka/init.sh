#!/bin/bash -e

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

${SCRIPT_DIR}/create-topics.sh
${SCRIPT_DIR}/register-avro-schemas.sh
