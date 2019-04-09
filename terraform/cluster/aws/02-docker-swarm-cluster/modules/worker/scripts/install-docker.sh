#!/usr/bin/env bash

apt-get update -y
DEBIAN_FRONTEND=noninteractive apt-get upgrade -yq
apt-get install apt-transport-https software-properties-common ca-certificates -y
curl -fsSL https://download.docker.com/linux/ubuntu/gpg |  apt-key add -
sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable"
apt-get update -y
apt-get install docker-ce -y
systemctl start docker &&  systemctl enable docker
dockerDaemon='{"experimental": true, "metrics-addr": "0.0.0.0:9323"}'
echo $dockerDaemon > /etc/docker/daemon.json
systemctl restart docker