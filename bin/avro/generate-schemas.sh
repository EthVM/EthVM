#!/bin/bash -e

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
ROOT_DIR=$(cd ${SCRIPT_DIR}/../..; pwd)

DIR_IN="/share/apps/avro-schemas"
JAVA_OUT="/share/apps/bolt/src/main/kotlin"

AVRO_TOOLS="docker run --rm -v ${ROOT_DIR}:/share enkryptio/avro-tools"

JAVA_GEN="${AVRO_TOOLS} java"

${JAVA_GEN} idl2schemata ${DIR_IN}/enkryptio.v1.avdl ${DIR_IN}/values

