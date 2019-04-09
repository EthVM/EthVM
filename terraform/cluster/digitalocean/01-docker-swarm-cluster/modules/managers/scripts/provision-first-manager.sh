#!/bin/bash

MANAGER_PRIVATE_ADDR=$1

# Wait until Docker is running correctly
while [ -z "$(${docker_cmd} info | grep CPUs)" ]; do
  echo Waiting for Docker to start...
  sleep 2
done

# If UWF is running, open the docker swarm mode ports
sudo ufw status | grep -qw active
UFW_INSTALLED=$?
if [ $UFW_INSTALLED -eq 0 ]; then
  sudo ufw allow 2377
  sudo ufw allow 7946
  sudo ufw allow 7946/udp
  sudo ufw allow 4789/udp
fi

${docker_cmd} swarm init --advertise-addr $MANAGER_PRIVATE_ADDR
