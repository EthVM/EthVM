#!/usr/bin/env bash

#give tiny bit of time for swarm to settle
sleep 10

#swarm prom

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

#ethstats
docker pull myetherwallet/docker-geth-lb:ethstats-instance
docker service create --name ethstats --env WS_SECRET=${ethstats_secret} --publish published=3030,target=3000 --replicas 1 myetherwallet/docker-geth-lb:ethstats-instance

#ethvm
chmod 777 /mnt/efs
mkdir -p /mnt/efs/zookeeper-1-volume
mkdir -p /mnt/efs/zookeeper-2-volume
mkdir -p /mnt/efs/zookeeper-3-volume
mkdir -p /mnt/efs/kafka-1-volume
mkdir -p /mnt/efs/kafka-2-volume
mkdir -p /mnt/efs/kafka-3-volume
mkdir -p /mnt/efs/kafka-connect-volume
mkdir -p /mnt/efs/control-center-volume
mkdir -p /mnt/efs/control-center-config-volume

# mkdir -p /mnt/efs/kafka-streams-volume
# mkdir -p /mnt/efs/traefik-volume
# mkdir -p /mnt/efs/mongodb-volume

docker node update --role manager root-manager
docker node update --role manager manager-1
docker node update --role manager manager-2

docker node update --role worker worker-1
docker node update --role worker worker-2
docker node update --role worker worker-3

docker node update --label-add io.ethvm.nodeType=processing-worker-1 worker-1
docker node update --label-add io.ethvm.nodeType=processing-worker-2 worker-2
docker node update --label-add io.ethvm.nodeType=processing-worker-3 worker-3

docker stack deploy --compose-file /tmp/swarm-aws.yml ethvm