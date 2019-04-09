#!/bin/bash

MANAGER_PRIVATE_ADDR=$1

# Wait until Docker is running correctly
while [ -z "$(docker info | grep CPUs)" ]; do
    echo Waiting for Docker to start...
    sleep 2
done

# If UWF is running, open the docker swarm mode ports
ufw status | grep -qw active
UFW_INSTALLED=$?
if [ $UFW_INSTALLED -eq 0 ]; then
    ufw allow 2377
    ufw allow 7946
    ufw allow 7946/udp
    ufw allow 4789/udp
fi
hostnamectl set-hostname root-manager
echo "127.0.1.1 root-manager" >> /etc/hosts

systemctl restart docker
docker swarm init --advertise-addr $MANAGER_PRIVATE_ADDR
