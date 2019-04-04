#!/usr/bin/env bash

# Give script sane defaults
set -o errexit
# set -o nounset
# set -o xtrace
# set -o verbose

# Export common vars
ORG="${ORG:-ethvm}"

ROOT_DIR=$(cd ${SCRIPT_DIR}/..; pwd)
APPS_PATH="${ROOT_DIR}/apps"
DOCKER_IMAGES_PATH="${ROOT_DIR}/docker/images"
PROJECTS_PATH="${SCRIPT_DIR}/projects.meta.json"

# ensure checks that whe have corresponding utilities installed
ensure() {
  if ! [ -x "$(command -v jq)" ]; then
    >&2 echo "jq is necessary to be installed to run this script!"
    >&2 echo "For installation instructions, please visit: https://stedolan.github.io/jq/download/"
    exit 1
  fi

  if ! [ -x "$(command -v docker)" ]; then
    >&2 echo "docker is necessary to be installed to run this script!"
    >&2 echo "For installation instructions, please visit: https://docs.docker.com/install/"
    exit 1
  fi

  if ! [ -x "$(command -v docker-compose)" ]; then
    >&2 echo "docker-compose is necessary to be installed to run this script!"
    >&2 echo "For installation instructions, please visit: https://docs.docker.com/compose/install/"
    exit 1
  fi

  if ! [ -x "$(command -v yarn)" ]; then
    >&2 echo "yarn is necessary to be installed to run this script!"
    >&2 echo "For installation instructions, please visit: https://yarnpkg.com/lang/en/docs/install/"
    exit 1
  fi

  if ! [ -x "$(command -v aws)" ]; then
    >&2 echo "awscli is necessary to be installed to run this script!"
    >&2 echo "For installation instructions, please visit: https://github.com/aws/aws-cli"
    exit 1
  fi

  if ! [ -x "$(command -v grep)" ]; then
    >&2 echo "grep is necessary to be installed to run this script!"
    exit 1
  fi

  if ! [ -x "$(command -v md5sum)" ]; then
    >&2 echo "md5sum is necessary to be installed to run this script!"
    exit 1
  fi
}

# prop - read .properties files and search elements by key
prop() {
  local path=${1}
  local key=${2:-'version'}
  grep ${key} ${path} | cut -d '=' -f2 | sed "s/'/ /g"
}

# to_version - tries to find the version, depending on the extension name
to_version() {
  if [[ "$1" =~ \.properties$ ]]; then
    echo $(prop "$1")
  else
    echo $(jq -r '.version' "$1")
  fi
}

read_version() {
  local raw_version_path=$(jq -car ".projects[] | select(.id==\"${1}\") | .version" ${PROJECTS_PATH})
  local version_path=$(eval "echo -e ${raw_version_path}")
  echo $(to_version "${version_path}")
}

# source the docker compose env variables

source ${ROOT_DIR}/.env

ensure
