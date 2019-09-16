#!/usr/bin/env bash

# Setup docker service
mkdir -p /etc/systemd/system/docker.service.d/
cat <<EOT >> /etc/systemd/system/docker.service.d/aws-credentials.conf
[Service]
Environment="AWS_ACCESS_KEY_ID=${access_key_id}"
Environment="AWS_SECRET_ACCESS_KEY=${secret_key_id}"
EOT

# Store AWS credentials also for AWS CLI
mkdir -p /home/ubuntu/.aws/
cat <<EOT >> /home/ubuntu/.aws/credentials
[default]
aws_access_key_id = ${access_key_id}
aws_secret_access_key = ${secret_key_id}
EOT

# Create convoy systemctl service
cat <<EOT >>/etc/systemd/system/convoy.service
[Unit]
Description=Convoy Daemon
Before=docker.service

[Service]
Environment="AWS_ACCESS_KEY_ID=${access_key_id}"
Environment="AWS_SECRET_ACCESS_KEY=${secret_key_id}"
ExecStart=/usr/local/bin/convoy daemon --ignore-config-file --drivers ebs
Type=simple
Restart=always
KillMode=process

[Install]
WantedBy=multi-user.target
EOT

# Reload services
systemctl daemon-reload

# Start convoy
systemctl enable convoy
systemctl start convoy

# Start docker
systemctl enable docker
systemctl start docker
