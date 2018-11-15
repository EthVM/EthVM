#!/bin/bash -e

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

${SCRIPT_DIR}/build-connector.sh

echo "Waiting 15 seconds for kafka-connect to restart"
sleep 15

${SCRIPT_DIR}/register-sink.sh
