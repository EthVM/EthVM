#!/bin/bash -e

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
ROOT_DIR=$(cd ${SCRIPT_DIR}/../..; pwd)

GO_OUT="/share/apps/eth/ethvm/models"
JAVA_OUT="/share/apps/bolt/src/main/kotlin"

AVRO_TOOLS="docker run --rm -v ${ROOT_DIR}:/share enkryptio/avro-tools"

GO_GEN="${AVRO_TOOLS} go"
JAVA_GEN="${AVRO_TOOLS} java"

${GO_GEN} --package=models ${GO_OUT} /share/apps/avro-schemas/block.schema.v1.asvc /share/apps/avro-schemas/balances.schema.v1.asvc /share/apps/avro-schemas/contract.schema.v1.asvc /share/apps/avro-schemas/pendingtx.schema.v1.asvc

${JAVA_GEN} compile schema /share/apps/avro-schemas/block.schema.v1.asvc ${JAVA_OUT}
${JAVA_GEN} compile schema /share/apps/avro-schemas/pendingtx.schema.v1.asvc ${JAVA_OUT}
${JAVA_GEN} compile schema /share/apps/avro-schemas/contract.schema.v1.asvc ${JAVA_OUT}
${JAVA_GEN} compile schema /share/apps/avro-schemas/balances.schema.v1.asvc ${JAVA_OUT}
