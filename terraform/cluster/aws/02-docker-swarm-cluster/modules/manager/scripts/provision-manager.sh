#!/bin/bash

# Wait until Docker is running correctly
while [ -z "$(docker info | grep CPUs)" ]; do
    echo Waiting for Docker to start...
    sleep 2
done

# Check if we got an error and are re-running
if [ "$(docker info | grep 'Swarm: error')" ]; then
    # Leave cluster before re-joining
    docker swarm leave
fi

# If UWF is running, open the docker swarm mode ports
ufw status | grep -qw active
UFW_INSTALLED=$?
if [ $UFW_INSTALLED -eq 0 ]; then
    ufw allow 2377
    ufw allow 7946
    ufw allow 7946/udp
    ufw allow 4789/udp
fi

hostnamectl set-hostname manager-${manager_id}
echo "127.0.1.1 manager-${manager_id}" >> /etc/hosts

systemctl restart docker

# Check if we are not already joined into a Swarm
if [ -z "$(docker info | grep 'Swarm: active')" ]; then
    # Join cluster
    docker swarm join --token ${join_token} ${root_manager_private_ip}:2377;
fi
