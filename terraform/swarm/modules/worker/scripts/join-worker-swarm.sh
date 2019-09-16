#!/bin/bash

# Wait until Docker is running correctly
while [ -z "$(docker info | grep CPUs)" ]; do
  echo Waiting for Docker to start...
  sleep 2
done

hostnamectl set-hostname ${hostname}
echo "127.0.1.1 ${hostname}" >> /etc/hosts

systemctl restart docker

# Join cluster
docker swarm join --token ${join_token} --availability active ${root_manager_private_ip}:2377
