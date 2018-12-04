#!/bin/bash

set -o nounset
set -o errexit
set -o verbose
set -o xtrace

retry.sh -t 100 "mongo $MONGODB_URL < mongodb-init.js"
