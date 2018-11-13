#!/bin/bash

set -x

kafka-topics --create --zookeeper zookeeper:2181 --replication-factor 1 --partitions 12 --topic blocks --config retention.ms=-1 --config cleanup.policy=compact
kafka-topics --create --zookeeper zookeeper:2181 --replication-factor 1 --partitions 12 --topic account-state --config retention.ms=-1 --config cleanup.policy=compact
kafka-topics --create --zookeeper zookeeper:2181 --replication-factor 1 --partitions 12 --topic pending-transactions --config retention.ms=-1 --config cleanup.policy=compact
kafka-topics --create --zookeeper zookeeper:2181 --replication-factor 1 --partitions 1 --topic metadata --config retention.ms=-1 --config cleanup.policy=compact
