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
  sudo apt-get -y install apt-transport-https software-properties-common ca-certificates sysstat jq docker-ce git make golang-go python-pip

  # Install updated awscli version
  sudo pip install awscli --upgrade --user

  # Extend PATH
  sudo bash -c 'echo "export PATH=/home/ubuntu/go/bin/:/home/ubuntu/.local/bin/:$PATH" >> /home/ubuntu/.bashrc'

  # Enable docker metrics
  sudo bash -c "echo '{ \"experimental\": true, \"metrics-addr\": \"0.0.0.0:9323\", \"log-driver\": \"json-file\", \"log-opts\": {\"max-size\": \"10m\", \"max-file\": \"5\"} }' > /etc/docker/daemon.json"

  # Install burry
  wget https://github.com/EthVM/burry.sh/releases/download/v0.4.0-38/burry -O /tmp/burry
  sudo mv /tmp/burry /usr/local/bin/burry
  sudo chmod +x /usr/local/bin/burry

  # Install pgbackrest
  wget https://github.com/EthVM/pgbackrest/releases/download/release%2F2.17/pgbackrest -O /tmp/pgbackrest
  sudo mv /tmp/pgbackrest /usr/local/bin/pgbackrest
  sudo chmod +x /usr/local/bin/pgbackrest

  # Allow the ec2-user to run docker commands without sudo
  sudo usermod -a -G docker ubuntu

  # Automate cleanup of leftovers that docker leaves every hour
  sudo bash -c "echo 'docker system prune -a --force' > /etc/cron.hourly/docker-cleanup.cron"

  # Clean installation leftovers
  sudo find /tmp -type f -atime +10 -delete
}

main
