#!/bin/bash

set -o nounset \
    -o errexit \
    -o verbose \
    -o xtrace

terraform init --plugin-dir='../../terraform-plugins'
