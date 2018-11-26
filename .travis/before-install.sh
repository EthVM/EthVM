#!/usr/bin/env bash

set -o errexit \
    -o pipefail

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
ROOT_DIR=$(cd ${SCRIPT_DIR}/..; pwd)

sudo apt update
sudo apt install -y jq

if [ "$ID" == "apps/server-e2e-test" ]; then

  # Download datasets with Git LFS (if applies)
  echo -e "machine github.com\n  login ${GITHUB_TOKEN}" > ~/.netrc
  git lfs fetch --all
  git lfs checkout

  # Install Docker
  curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
  sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable"
  sudo apt update
  sudo apt -y -o Dpkg::Options::="--force-confnew" install docker-ce

  # Install docker-compose
  sudo curl -L "https://github.com/docker/compose/releases/download/1.23.1/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
  sudo chmod +x /usr/local/bin/docker-compose

  # Prepare data
  docker-compose -f ${ROOT_DIR}/docker-compose.travis.yml up -d

  # Wait 30 secs to allow container proper initialization
  sleep 30
fi

# Install global jest
yarn global add jest
