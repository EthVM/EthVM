#!/usr/bin/env bash

set -o errexit

main() {
  setup_docker
  update_docker_configuration

  echo "SUCCESS:
  Done! Finished setting up Travis machine.
  "
}

setup_docker() {
  echo "INFO:
  Setting up docker.
  "

  sudo apt remove docker docker-engine docker.io
  sudo apt install apt-transport-https ca-certificates curl gnupg-agent software-properties-common
  curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
  sudo apt-key fingerprint 0EBFCD88
  sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable"
  sudo apt update -y
  sudo apt install docker-ce

  docker info
}

update_docker_configuration() {
  echo "INFO:
  Updating docker configuration
  "

  echo '{
  "experimental": true,
  "storage-driver": "overlay2",
  "max-concurrent-downloads": 50,
  "max-concurrent-uploads": 50
}' | sudo tee /etc/docker/daemon.json
  sudo service docker restart
}

main
