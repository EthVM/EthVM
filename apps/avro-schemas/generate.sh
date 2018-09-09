#!/bin/bash -e


AVRO_TOOLS="docker run --rm -v $(pwd):/share bluerose/avro-tools"

echo "Generating go files"

${AVRO_TOOLS} go --package=models go /share/block.schema.v1.asvc /share/pendingtx.schema.v1.asvc

echo "Generating java files"

${AVRO_TOOLS} java compile schema block.schema.v1.asvc java
${AVRO_TOOLS} java compile schema pendingtx.schema.v1.asvc java
