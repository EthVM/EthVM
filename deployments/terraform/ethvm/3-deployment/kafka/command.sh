sh -exc "unset KAFKA_PORT && export KAFKA_BROKER_ID=${HOSTNAME##*-} && export KAFKA_ADVERTISED_LISTENERS=PLAINTEXT://${POD_IP}:9092 && exec /etc/confluent/docker/run"
