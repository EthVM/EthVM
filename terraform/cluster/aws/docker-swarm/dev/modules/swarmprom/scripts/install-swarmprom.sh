#!/usr/bin/env bash

apt install git
rm -rf swarmprom
git clone https://github.com/stefanprodan/swarmprom.git
cd swarmprom
ADMIN_USER=${admin_user} \
ADMIN_PASSWORD=${admin_password} \
SLACK_URL=https://hooks.slack.com/services/${slack_token} \
SLACK_CHANNEL=${slack_channel} \
SLACK_USER=${slack_user} \
docker stack deploy -c docker-compose.yml swarmprom

docker pull myetherwallet/docker-geth-lb:ethstats-instance
docker service create --name ethstats --env WS_SECRET=${ethstats_secret} --publish published=3030,target=3000 --replicas 1 myetherwallet/docker-geth-lb:ethstats-instance