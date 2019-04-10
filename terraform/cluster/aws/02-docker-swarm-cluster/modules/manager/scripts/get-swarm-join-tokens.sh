#!/usr/bin/env bash

# Processing JSON in shell scripts
# https://www.terraform.io/docs/providers/external/data_source.html#processing-json-in-shell-scripts
# Credits to https://github.com/knpwrs/docker-swarm-terraform for inspiration on how to do this

eval "$(jq -r '@sh "HOST=\(.host) USER=\(.user) PRIVATE_KEY=\(.private_key)"')"

# Fetch the manager join token
MANAGER=$(ssh -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null -i $PRIVATE_KEY \
$USER@$HOST timeout 5 sudo docker swarm join-token manager -q)

# Fetch the worker join token
WORKER=$(ssh -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null -i $PRIVATE_KEY \
$USER@$HOST timeout 5 sudo docker swarm join-token worker -q)

# Produce a JSON object containing the tokens
jq -n --arg manager "${MANAGER}" --arg worker "$WORKER" \
'{"manager":$manager,"worker":$worker}'