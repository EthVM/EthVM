#!/bin/bash

# This script extracts the number out of the pod's hostname and sets it as zookeepers id.
# Url: https://stackoverflow.com/a/46773580

set -x
set -e

# Exact paths may vary according to your setup
MYID_FILE="/var/lib/zookeeper/data/myid"
ZOOCFG_FILE="/opt/zookeeper/conf/zoo.cfg"

# Create myid-file
# Extract only numbers from hostname
id=$(hostname | tr -d -c 0-9)

# change own hostname to 0.0.0.0
# otherwise, the own hostname will resolve to 127.0.0.1
# https://stackoverflow.com/a/40750900/5764665
fullHostname="$(hostname).zookeeper-headless"
sed -i -e "s/${fullHostname}/0.0.0.0/g" "${ZOOCFG_FILE}"

exec zkServer.sh start-foreground
