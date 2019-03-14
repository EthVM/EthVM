#!/bin/bash

# Wait until Docker is running correctly
while [ -z "$(sudo docker info | grep CPUs)" ]; do
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

# Join cluster
sudo docker swarm join --token ${join_token} --availability active ${root_manager_private_ip}:2377
