#!/usr/bin/env bash

# Give script sane defaults
set -o errexit
# set -o nounset

if [ "${TRACE:-}" == "true" ]; then
  set -o xtrace
  set -o verbose
fi

# Export common vars
ORG="${ORG:-ethvm}"

ROOT_DIR=$(cd ${SCRIPT_DIR}/..; pwd)
APPS_PATH="${ROOT_DIR}/apps"
DOCKER_IMAGES_PATH="${ROOT_DIR}/docker/images"
DOCKER_RUN_META_PATH="${SCRIPT_DIR}/docker-run.meta.json"
DOCKER_BUILD_META_PATH="${SCRIPT_DIR}/docker-build.meta.json"

# ---------------------------------------------------------
#   Helper Functions
# ---------------------------------------------------------

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

  local raw_version_path=$(jq -car ".projects[] | select(.id==\"${1}\") | .version" ${DOCKER_RUN_META_PATH})
  local version_path=$(eval "echo -e ${raw_version_path}")
  echo $(to_version "${version_path}")

}

# invalid - prints section type message
section() {

  local green=`tput setaf 2`
  local reset=`tput sgr0`

  echo -e "${green}"
  echo -e "-------------------------------------------------------------------------------------"
  echo -e "  $1"
  echo -e "-------------------------------------------------------------------------------------"
  echo -e "${reset}"

}

# invalid - prints invalid message
invalid() {

  local bold=`tput bold`
  local red=`tput setaf 1`
  local reset=`tput sgr0`

  >&2 echo -e "${red}${bold}ERROR:${reset} ${1}"

}

# warning - prints a warning message
warning() {

  local bold=`tput bold`
  local yellow=`tput setaf 3`
  local reset=`tput sgr0`

  >&2 echo -e "${yellow}${bold}WARNING:${reset} ${1}"

}

# info - prints an info message
info() {

  local bold=`tput bold`
  local green=`tput setaf 2`
  local reset=`tput sgr0`

  >&2 echo -e "${green}${bold}INFO:${reset} ${1}"

}

# ---------------------------------------------------------
#   Checks
# ---------------------------------------------------------

# ensure checks that we have corresponding utilities installed
ensure() {

  if ! [ -x "$(command -v jq)" ]; then
    >&2 invalid "jq is necessary to be installed to run this script!\n\tFor installation instructions, please visit: https://stedolan.github.io/jq/download/"
    exit 1
  fi

  if ! [ -x "$(command -v docker)" ]; then
    >&2 invalid "docker is necessary to be installed to run this script!\n\tFor installation instructions, please visit: https://docs.docker.com/install/"
    exit 1
  fi

  if ! [ -x "$(command -v docker-compose)" ]; then
    >&2 invalid "docker-compose is necessary to be installed to run this script!\n\tFor installation instructions, please visit: https://docs.docker.com/compose/install/"
    exit 1
  fi

  if ! [ -x "$(command -v javac)" ]; then
    >&2 invalid "JAVA is necessary to be installed to run this script!\n\tFor installation instructions, please use your OS package manager"
    exit 1
  else
    local version=$(java -version 2>&1 | sed -n ';s/.* version "\(.*\)\.\(.*\)\..*"/\1\2/p;')
    [[ $version != "18" ]] && >&2 warning "It looks like your JAVA version is not 1.8.\n\tWe recommend you to switch to version 1.8 in order to avoid issues while executing some Kafka commands!"
  fi

  if ! [ -x "$(command -v yarn)" ]; then
    >&2 warning "yarn is not installed on the system! Although not completely necessary, it's recommended its installation.\n\tFor installation instructions, please visit: https://yarnpkg.com/lang/en/docs/install/"
  fi

  if ! [ -x "$(command -v curl)" ]; then
    >&2 invalid "curl is necessary to be installed to run this script!\n\tFor installation instructions, please visit: https://curl.haxx.se/"
    exit 1
  fi

  if ! [ -x "$(command -v grep)" ]; then
    >&2 invalid "grep is necessary to be installed to run this script!\n\tFor installation instructions, please use your OS package manager"
    exit 1
  fi

  if ! [ -x "$(command -v md5sum)" ]; then
    >&2 invalid "md5sum is necessary to be installed to run this script!\n\tFor installation instructions, please use your OS package manager"
    exit 1
  fi

}
