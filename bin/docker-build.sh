#!/usr/bin/env bash

set -o errexit
set -o nounset

# set -o xtrace
# set -o verbose

# Give script sane defaults
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
ROOT_DIR=$(cd ${SCRIPT_DIR}/..; pwd)

# ensure checks that whe have corresponding utilities installed
ensure() {
  if ! [ -x "$(command -v jq)" ]; then
    >&2 echo "jq is necessary to be installed to run this script!"
    exit 1
  fi

  if ! [ -x "$(command -v docker)" ]; then
    >&2 echo "docker is necessary to be installed to run this script!"
    exit 1
  fi
}
ensure

# Utility fns

# prop - read .properties files and search elements by key
prop() {
  local path=${1}
  local key=${2:-'version'}
  grep ${key} ${path} | cut -d '=' -f2
}

# inArray - tests that certain element exists inside an array
inArray () {
  local e match="$1"
  shift
  for e; do [[ "$e" == "$match" ]] && return 0; done
  return 1
}

# DEFAULT VARS
ORG="enkryptio"
APPS_PATH="${ROOT_DIR}/apps"
DOCKER_IMAGES_PATH="${ROOT_DIR}/docker/images"

# Syntax: Key - Value: project-id ; version ; docker file path ; context path
declare -A PROJECTS
PROJECTS["api"]="api;$(jq .version "${APPS_PATH}/server/package.json");${APPS_PATH}/server/Dockerfile;${APPS_PATH}/"
PROJECTS["bolt"]="bolt;$(prop "${APPS_PATH}/bolt/version.properties");${APPS_PATH}/bolt/Dockerfile;${APPS_PATH}/bolt/"
PROJECTS["ethereumj"]="ethereumj;$(prop "${APPS_PATH}/ethereumj/version.properties");${APPS_PATH}/ethereumj/Dockerfile;${APPS_PATH}/ethereumj/"
PROJECTS["explorer"]="explorer;$(jq .version "${APPS_PATH}/ethvm/package.json");${APPS_PATH}/ethvm/Dockerfile;${APPS_PATH}/"
PROJECTS["kafka-connect"]="kafka-connect;$(prop "${DOCKER_IMAGES_PATH}/kafka-connect/version.properties");${DOCKER_IMAGES_PATH}/kafka-connect/Dockerfile;${DOCKER_IMAGES_PATH}/kafka-connect/"
PROJECTS["kafka-connect-ethvm-init"]="kafka-connect-ethvm-init;$(prop "${DOCKER_IMAGES_PATH}/kafka-connect-ethvm-init/version.properties");${DOCKER_IMAGES_PATH}/kafka-connect-ethvm-init/Dockerfile;${DOCKER_IMAGES_PATH}/kafka-connect-ethvm-init/"
PROJECTS["kafka-ethvm-init"]="kafka-ethvm-init;$(prop "${DOCKER_IMAGES_PATH}/kafka-ethvm-init/version.properties");${DOCKER_IMAGES_PATH}/kafka-ethvm-init/Dockerfile;${DOCKER_IMAGES_PATH}/kafka-ethvm-init"
PROJECTS["mongodb-dev"]="mongodb-dev;$(prop "${DOCKER_IMAGES_PATH}/mongodb-dev/version.properties");${DOCKER_IMAGES_PATH}/mongodb-dev/Dockerfile;${DOCKER_IMAGES_PATH}/mongodb-dev"
PROJECTS["mongodb-ethvm-init"]="mongodb-ethvm-init;$(prop "${DOCKER_IMAGES_PATH}/mongodb-ethvm-init/version.properties");${DOCKER_IMAGES_PATH}/mongodb-ethvm-init/Dockerfile;${DOCKER_IMAGES_PATH}/mongodb-ethvm-init/"
PROJECTS["mongodb-install"]="mongodb-install;$(prop "${DOCKER_IMAGES_PATH}/mongodb-install/version.properties");${DOCKER_IMAGES_PATH}/mongodb-install/Dockerfile;${DOCKER_IMAGES_PATH}/mongodb-install/"
PROJECTS["zookeeper"]="zookeeper;$(prop "${DOCKER_IMAGES_PATH}/zookeeper/version.properties");${DOCKER_IMAGES_PATH}/zookeeper/Dockerfile;${DOCKER_IMAGES_PATH}/zookeeper/"

# invalid - prints invalid message
invalid() {
  >&2 echo "Invalid argument passed!"
  >&2 echo ""
}

# usage - prints the help for this command
usage() {
  echo ""
  echo "Builds different docker images easily for EthVM project."
  echo ""
  echo "Usage:"
  echo "    docker-build <command>"
  echo ""
  echo "Commands:"
  echo "    build <image>  Build a docker image from this repo."
  echo "    push  <image>  Push an image to the registered docker registry."
  echo ""
  echo "Images:"
  echo "    [${!PROJECTS[*]}]"
}

# build - builds docker images
build() {
  local name=$(echo "${PROJECTS[$1]}" | cut -d ";" -f 1)
  local dockerfile=$(echo "${PROJECTS[$1]}" | cut -d ";" -f 3)
  local context=$(echo "${PROJECTS[$1]}" | cut -d ";" -f 4)
  local version=$(echo "${PROJECTS[$1]}" | cut -d ";" -f 2 | sed -r s/[\"]+//g)
  docker build -t "${ORG}/${name}:${version}" -f ${dockerfile} ${context}
}

# push - sends the built docker image to the registered registry
push() {
  local name=$(echo "${PROJECTS[$1]}" | cut -d ";" -f 1)
  local version=$(echo "${PROJECTS[$1]}" | cut -d ";" -f 2 | sed -r s/[\"]+//g)
  docker push "${ORG}/${name}:${version}"
}

# run - executes main script
run() {
  local command=${1}
  local image=${2}

  case ${command} in
    build)
      case ${image} in
        all)
          for image in "${!PROJECTS[@]}"; do
            build "$image"
          done
          exit 0
        ;;

        *)
          # Test if image var is empty
          if [ -z "${image}" ]; then
            usage
            exit 0
          fi

          # Check if image var is inside our array of known images
          inArray "${image}" ${!PROJECTS[*]}
          local status=$?
          if [ "$status" -eq "0" ]; then
            build $image
            exit 0
          fi

          # Otherwhise print error message, help and exit
          invalid
          usage
          exit 1
        ;;
      esac
    ;;

    push)
      case ${image} in
        all)
          for image in "${!PROJECTS[@]}"; do
            push "$image"
          done
          exit 0
        ;;

        *)
          # Test if image var is empty
          if [ -z "${image}" ]; then
            usage
            exit 0
          fi

          # Check if image var is inside our array of known images
          inArray "${image}" ${!PROJECTS[*]}
          local status=$?
          if [ "$status" -eq "0" ]; then
            push $image
            exit 0
          fi

          # Otherwhise print error message, help and exit
          invalid
          usage
          exit 1
        ;;
      esac
    ;;

    *)
      usage
      exit 0
    ;;
  esac
}
run "$@"
