#!/bin/bash

sudo mkdir -p /var/ssl
sudo mv ~/.docker/{server-cert.pem,server-key.pem,ca.pem} /var/ssl/

sudo mkdir -p /etc/systemd/system/docker.service.d
sudo bash -c 'cat<<-EOF > /etc/systemd/system/docker.service.d/10-tls-verify.conf
[Service]
Environment="DOCKER_OPTS=--tlsverify=true --tlscacert=/var/ssl/ca.pem --tlscert=/var/ssl/server-cert.pem --tlskey=/var/ssl/server-key.pem"
ExecStart=
ExecStart=/usr/bin/dockerd -H tcp://0.0.0.0:2376 -H unix://var/run/docker.sock --tlsverify=true --tlscacert=/var/ssl/ca.pem --tlscert=/var/ssl/server-cert.pem --tlskey=/var/ssl/server-key.pem
EOF'

sudo systemctl daemon-reload
sudo systemctl restart docker
