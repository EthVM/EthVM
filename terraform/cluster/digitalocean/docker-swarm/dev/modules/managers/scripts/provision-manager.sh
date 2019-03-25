#!/bin/bash

MANAGER_PRIVATE_ADDR=$1
JOIN_TOKEN=$2

# Wait until Docker is running correctly
while [ -z "$(${docker_cmd} info | grep CPUs)" ]; do
  echo Waiting for Docker to start...
  sleep 2
done

# Check if we got an error and are re-running
if [ "$(${docker_cmd} info | grep 'Swarm: error')" ]; then
  # Leave cluster before re-joining
  ${docker_cmd} swarm leave
fi

# If UWF is running, open the docker swarm mode ports
sudo ufw status | grep -qw active
UFW_INSTALLED=$?
if [ $UFW_INSTALLED -eq 0 ]; then
  sudo ufw allow 2377
  sudo ufw allow 7946
  sudo ufw allow 7946/udp
  sudo ufw allow 4789/udp
fi

# Check if we are not already joined into a Swarm
if [ -z "$(${docker_cmd} info | grep 'Swarm: active')" ]; then
  # Join cluster
  ${docker_cmd} swarm join --token $JOIN_TOKEN $MANAGER_PRIVATE_ADDR:2377;
fi
