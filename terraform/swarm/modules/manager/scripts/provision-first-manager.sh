#!/usr/bin/env bash

# Wait until Docker is running correctly
while [ -z "$(docker info | grep CPUs)" ]; do
  echo "Waiting for Docker to start..."
  sleep 2
done

hostnamectl set-hostname manager-1
echo "127.0.1.1 manager-1" >> /etc/hosts

systemctl restart docker

docker swarm init --advertise-addr $1
