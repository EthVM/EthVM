#!/bin/bash -e

if [ -n "`$SHELL -c 'echo $ZSH_VERSION'`" ]; then
SCRIPT_DIR="$( cd "$( dirname "${(%):-%x}" )" && pwd )"
elif [ -n "`$SHELL -c 'echo $BASH_VERSION'`" ]; then
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
fi

ROOT_DIR=$(cd ${SCRIPT_DIR}/../..; pwd)

DIR_IN="/share/apps/avro-schemas"
JAVA_OUT="/share/apps/bolt/src/main/kotlin"

AVRO_TOOLS="docker run --rm -v ${ROOT_DIR}:/share enkryptio/avro-tools"

GO_GEN="${AVRO_TOOLS} go"
JAVA_GEN="${AVRO_TOOLS} java"

${JAVA_GEN} idl2schemata ${DIR_IN}/enkryptio.v1.avdl ${DIR_IN}/values

