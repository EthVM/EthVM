#!/bin/bash -e

AVRO_TOOLS="docker run --rm -v $(pwd):/share enkryptio/avro-tools"

GO_GEN="${AVRO_TOOLS} go"
JAVA_GEN="${AVRO_TOOLS} java"

${GO_GEN} --package=models /share/apps/avro-schemas/go /share/apps/avro-schemas/block.schema.v1.asvc /share/apps/avro-schemas/pendingtx.schema.v1.asvc

${JAVA_GEN} compile schema /share/apps/avro-schemas/block.schema.v1.asvc /share/apps/avro-schemas/java
${JAVA_GEN} compile schema /share/apps/avro-schemas/pendingtx.schema.v1.asvc /share/apps/avro-schemas/java
