#!/bin/bash -e

if [ -n "`$SHELL -c 'echo $ZSH_VERSION'`" ]; then
SCRIPT_DIR="$( cd "$( dirname "${(%):-%x}" )" && pwd )"
elif [ -n "`$SHELL -c 'echo $BASH_VERSION'`" ]; then
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
fi

ROOT_DIR=$(cd ${SCRIPT_DIR}/../..; pwd)

DIR_IN="/share/apps/avro-schemas"

BOLT_OUT="/share/apps/bolt/src/main/kotlin"
ETHJ_OUT="/share/apps/ethereumj/ethereumj-core/src/main/java"

AVRO_TOOLS="docker run --rm -v ${ROOT_DIR}:/share enkryptio/avro-tools"

JAVA_GEN="${AVRO_TOOLS} java"

${JAVA_GEN} compile schema /share/apps/avro-schemas/values ${BOLT_OUT}
${JAVA_GEN} compile schema /share/apps/avro-schemas/values ${ETHJ_OUT}
