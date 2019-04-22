#!/usr/bin/env bash

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# import utils
source ${SCRIPT_DIR}/env.sh

# verify we have required utilities installed
ensure

run() {

  local command="${1}"
  local action="${2}"

  local filepath="${ROOT_DIR}/datasets/ethvm_dev.sql.gz"

  case "${command}" in

    dump)
      docker-compose exec -u postgres timescale pg_dump ethvm_dev | gzip > ${filepath}
      md5sum ${filepath} > ${filepath}.md5
      ;;

    upload-dump)
      aws s3 cp ${filepath}.md5 s3://ethvm/datasets/ --profile ethvm --acl public-read
      aws s3 cp ${filepath} s3://ethvm/datasets/ --profile ethvm --acl public-read
      ;;

  esac
}
run "$@"
