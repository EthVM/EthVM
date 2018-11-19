#!/bin/bash
echo "$DOCKER_PASSWORD" | docker login -u "$DOCKER_USERNAME" --password-stdin
docker build $TRAVIS_BUILD_DIR/apps/ethvm . -t niktrix/ethvm
docker push niktrix/ethvm
docker build $TRAVIS_BUILD_DIR/apps/server . -t niktrix/server
docker push niktrix/server
