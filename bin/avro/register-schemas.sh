#!/bin/bash -e

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
ROOT_DIR=$(cd ${SCRIPT_DIR}/../../; pwd)
AVRO_DIR=$(cd ${ROOT_DIR}/apps/avro; pwd)

echo "Generating avro schemas"
cd ${AVRO_DIR}
./gradlew :generateSchema

SCHEMA_DIR=$(cd ${AVRO_DIR}/build/generated-main-avro-avsc/io/enkrypt/avro; pwd)

VALUE_SCHEMAS=(\
  'capture/BlockSummaryRecord.avsc' \
  'processing/FungibleTokenTransferRecord.avsc' \
  'processing/FungibleTokenBalanceRecord.avsc' \
  'processing/NonFungibleTokenTransferRecord.avsc' \
  'processing/NonFungibleTokenBalanceRecord.avsc' \
  'processing/MetricRecord.avsc' \
  'processing/ContractCreationRecord.avsc' \
  'processing/ContractSuicideRecord.avsc' \
)

KEY_SCHEMAS=(\
  'processing/FungibleTokenBalanceKeyRecord.avsc' \
  'processing/NonFungibleTokenBalanceKeyRecord.avsc' \
  'processing/MetricKeyRecord.avsc' \
  'processing/ContractKeyRecord.avsc' \
)

for path in "${KEY_SCHEMAS[@]}"; do

  NAME=$(echo ${path} | sed -e 's/^.*\/\(.*\)Record.avsc$/\1/g')

  echo "Registering key schema: ${NAME}..."
  export SCHEMA=$(jq tostring ${SCHEMA_DIR}/${path})
  ID=$(curl -s -H "Content-Type: application/vnd.schemaregistry.v1+json" -X POST -d"{\"schema\":$SCHEMA}" http://kafka-schema-registry.ethvm.lan/subjects/raw-${NAME}-key/versions | jq .id)
  echo "Schema registered with id: ${ID}"

done

for path in "${VALUE_SCHEMAS[@]}"; do

  NAME=$(echo ${path} | sed -e 's/^.*\/\(.*\)Record.avsc$/\1/g')

  echo "Registering value schema: ${NAME}..."
  export SCHEMA=$(jq tostring ${SCHEMA_DIR}/${path})
  ID=$(curl -s -H "Content-Type: application/vnd.schemaregistry.v1+json" -X POST -d"{\"schema\":$SCHEMA}" http://kafka-schema-registry.ethvm.lan/subjects/raw-${NAME}-value/versions | jq .id)
  echo "Schema registered with id: ${ID}"

done

