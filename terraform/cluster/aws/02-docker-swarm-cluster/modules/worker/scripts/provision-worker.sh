#!/bin/bash

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

hostnamectl set-hostname worker-${worker_id}
echo "127.0.1.1 worker-${worker_id}" >> /etc/hosts

systemctl restart docker
# Join cluster
docker swarm join --token ${join_token} --availability active ${root_manager_private_ip}:2377