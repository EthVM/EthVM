#!/usr/bin/env bash

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

docker service rm ethstats || true
docker service create --name ethstats --env WS_SECRET=${ethstats_secret} --publish published=3030,target=3000 --replicas 1 myetherwallet/docker-geth-lb:ethstats-instance

#ethvm
chmod 777 /mnt/efs

volumes=("zookeeper-1-volume" "zookeeper-2-volume" "zookeeper-3-volume" "kafka-1-volume" "kafka-2-volume" "kafka-3-volume" "kafka-connect-volume" "control-center-volume" "control-center-config-volume")
for volume in "$${volumes[@]}"; do
    mkdir -p /mnt/efs/$volume
done

docker node update --role manager root-manager
docker node update --role manager manager-1
docker node update --role manager manager-2

docker node update --role worker worker-1
docker node update --role worker worker-2
docker node update --role worker worker-3

docker node update --label-add com.ethvm.nodeType=processing-worker-1 worker-1
docker node update --label-add com.ethvm.nodeType=processing-worker-2 worker-2
docker node update --label-add com.ethvm.nodeType=processing-worker-3 worker-3

docker stack deploy --compose-file /tmp/swarm-aws.yml ethvm
