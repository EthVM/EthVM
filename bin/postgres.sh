#!/usr/bin/env bash

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# import utils
source ${SCRIPT_DIR}/env.sh

# verify we have required utilities installed
ensure

# verify we have required utilities installed
ensure

run() {

  local command="${1}"
  local action="${2}"

  local datasets_dir="${ROOT_DIR}/datasets"
  local branch=$(git branch 2>/dev/null | grep '^*' | colrm 1 2 | tr / -)
  local filenames=("principal-${branch}.sql.gz" "metrics-${branch}.sql.gz")

  case "${command}" in

    dump)

        local filepath="${datasets_dir}/${filenames[0]}"
        docker-compose exec -u postgres db-principal pg_dump ethvm_dev | gzip > ${filepath}
        cd ${datasets_dir} && md5sum ${filenames[0]} > ${filenames[0]}.md5 # to avoid full path in md5 sum file

        local filepath="${datasets_dir}/${filenames[1]}"
        docker-compose exec -u postgres db-metrics pg_dump ethvm_dev | gzip > ${filepath}
        cd ${datasets_dir} && md5sum ${filenames[1]} > ${filenames[1]}.md5 # to avoid full path in md5 sum file

      ;;

    upload-dump)

      for filename in "${filenames[@]}"; do

        local filepath="${datasets_dir}/${filename}"
        aws s3 cp ${filepath}.md5 s3://ethvm/datasets/ --profile ethvm --acl public-read
        aws s3 cp ${filepath} s3://ethvm/datasets/ --profile ethvm --acl public-read

      done

      ;;

  esac

}

run "$@"
