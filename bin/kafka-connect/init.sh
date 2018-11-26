#!/bin/bash -e

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

${SCRIPT_DIR}/build-connector.sh

echo "Waiting 30 seconds for kafka-connect to restart"
sleep 30

${SCRIPT_DIR}/register-sink.sh
