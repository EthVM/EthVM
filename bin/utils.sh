#!/usr/bin/env bash

# ensure checks that whe have corresponding utilities installed
ensure() {
  if ! [ -x "$(command -v jq)" ]; then
    >&2 echo "jq is necessary to be installed to run this script!"
    exit 1
  fi

  if ! [ -x "$(command -v docker)" ]; then
    >&2 echo "docker is necessary to be installed to run this script!"
    exit 1
  fi

  if ! [ -x "$(command -v docker-compose)" ]; then
    >&2 echo "docker-compose is necessary to be installed to run this script!"
    exit 1
  fi

  if ! [ -x "$(command -v yarn)" ]; then
    >&2 echo "yarn is necessary to be installed to run this script!"
    exit 1
  fi

  if ! [ -x "$(command -v grep)" ]; then
    >&2 echo "grep is necessary to be installed to run this script!"
    exit 1
  fi

  if ! [ -x "$(command -v git-lfs)" ]; then
    >&2 echo "git-lfs is necessary to be installed to run this script!"
    exit 1
  fi
}

# prop - read .properties files and search elements by key
prop() {
  local path=${1}
  local key=${2:-'version'}
  grep ${key} ${path} | cut -d '=' -f2
}
