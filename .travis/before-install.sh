#!/usr/bin/env bash

# Give script sane defaults
set -o errexit
set -o pipefail

# Useful VARs
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
ROOT_DIR=$(cd ${SCRIPT_DIR}/..; pwd)

update() {
  sudo apt update
}

install_jq() {
  sudo apt install -y jq
}

install_docker() {
  curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
  sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable"
  sudo apt update
  sudo apt -y -o Dpkg::Options::="--force-confnew" install docker-ce
}

install_docker_compose() {
  sudo curl -L "https://github.com/docker/compose/releases/download/1.23.1/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
  sudo chmod +x /usr/local/bin/docker-compose
}

install_jest() {
  yarn global add jest
}

prepare_e2e_environment() {
  # Download datasets with Git LFS (if applies)
  echo -e "machine github.com\n  login ${GITHUB_TOKEN}" > ~/.netrc

  # Git LFS
  git lfs fetch
  git lfs checkout

  # Prepare data
  docker-compose -f ${ROOT_DIR}/docker-compose.travis.yml up -d

  # Wait 60 secs to allow container proper initialization
  sleep 60
}

run() {
  update
  install_jq
  install_jest

  if [ "$ID" == "api-e2e-tests" ]; then
    install_docker
    install_docker_compose
    prepare_e2e_environment
  fi
}
run
