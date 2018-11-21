#!/bin/bash

set -o nounset \
    -o errexit \
    -o verbose \
    -o xtrace

retry.sh -t 100 mongo $MONGODB_URL /mongodb-init.js
