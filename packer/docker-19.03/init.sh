#!/bin/bash -e

main() {
  sudo apt-get -y update
  DEBIAN_FRONTEND=noninteractive sudo apt-get upgrade -yq

  # Add extra repositories
  sudo bash -c "curl -fsSL https://download.docker.com/linux/ubuntu/gpg | apt-key add -"
  sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable"
  sudo add-apt-repository ppa:longsleep/golang-backports

  # Install dependencies
  sudo apt-get -y update
  sudo apt-get -y install apt-transport-https software-properties-common ca-certificates sysstat jq docker-ce awscli git make golang-go

  # Extend PATH
  sudo bash -c 'echo "export PATH=/home/ubuntu/go/bin/:$PATH" >> /home/ubuntu/.bashrc'

  # Enable docker metrics
  sudo bash -c "echo '{ \"experimental\": true, \"metrics-addr\": \"0.0.0.0:9323\" }' > /etc/docker/daemon.json"

  # Install convoy plugin
  wget https://github.com/EthVM/convoy/releases/download/v0.6.0/convoy.tar.gz -O /tmp/convoy.tar.gz
  tar xvzf /tmp/convoy.tar.gz -C /tmp/
  sudo cp /tmp/convoy/convoy /tmp/convoy/convoy-pdata_tools /usr/local/bin/
  sudo mkdir -p /etc/docker/plugins/
  sudo bash -c 'echo "unix:///var/run/convoy/convoy.sock" > /etc/docker/plugins/convoy.spec'

  # Install ebsinit
  git clone https://github.com/EthVM/go-ebsinit /tmp/go-ebsinit
  sudo bash -c "cd /tmp/go-ebsinit && make && mv /tmp/go-ebsinit/ebsinit_linux_amd64 /usr/local/bin/ebsinit"

  # Install burry
  wget https://github.com/EthVM/burry.sh/releases/download/v0.4.0-38/burry -O /tmp/burry
  sudo mv /tmp/burry /usr/local/bin

  # Allow the ec2-user to run docker commands without sudo
  sudo usermod -a -G docker ubuntu

  # Automate cleanup of leftovers that docker leaves every hour
  sudo bash -c "echo 'docker system prune -a --force' > /etc/cron.hourly/docker-cleanup.cron"

  # Clean installation leftovers
  sudo find /tmp -type f -atime +10 -delete
}

main
