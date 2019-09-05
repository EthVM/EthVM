#!/bin/bash -e

main() {
  sudo apt-get -y update
  DEBIAN_FRONTEND=noninteractive sudo apt-get upgrade -yq

  # Install dependencies and docker
  sudo bash -c "curl -fsSL https://download.docker.com/linux/ubuntu/gpg | apt-key add -"
  sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable"
  sudo add-apt-repository ppa:longsleep/golang-backports
  sudo apt-get -y update
  sudo apt-get -y install apt-transport-https software-properties-common ca-certificates sysstat jq docker-ce awscli git make golang-go

  # Enable docker metrics
  sudo bash -c "echo '{ \"experimental\": true, \"metrics-addr\": \"0.0.0.0:9323\" }' > /etc/docker/daemon.json"

  # Install convoy plugin
  wget https://github.com/EthVM/convo/releases/download/v0.6.0/convoy.tar.gz -O /tmp/convoy.tar.gz
  tar xvzf /tmp/convoy.tar.gz -C /tmp/
  sudo cp /tmp/convoy/convoy /tmp/convoy/convoy-pdata_tools /usr/local/bin/
  sudo mkdir -p /etc/docker/plugins/
  sudo bash -c 'echo "unix:///var/run/convoy/convoy.sock" > /etc/docker/plugins/convoy.spec'

  # Allow the ec2-user to run docker commands without sudo
  sudo usermod -a -G docker ubuntu

  # Every time we stop and recreate our app, old containers, images and networks will be left over
  # Run this every hour to clean them up
  sudo bash -c "echo 'docker system prune --force' > /etc/cron.hourly/docker-cleanup.cron"

  # Clone ebsinit
  git clone https://github.com/EthVM/go-ebsinit /tmp/go-ebsinit
  sudo bash -c "cd /tmp/go-ebsinit && make && mv /tmp/go-ebsinit/ebsinit_linux_amd64 /usr/local/bin/ebsinit"

  # Clean leftovers
  sudo find /tmp -type f -atime +10 -delete
}

main
