#!/usr/bin/env bash

# Give script sane defaults
set -o errexit
set -o nounset
# set -o xtrace
# set -o verbose

# Useful VARS
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
ROOT_DIR=$(cd ${SCRIPT_DIR}/..; pwd)

# import utils
source ${SCRIPT_DIR}/utils.sh

# monkey_usage - prints monkey subcommand usage
terraform_usage() {
  echo ""
  echo "Utility related to Terraform tool."
  echo ""
  echo "Usage:"
  echo "  ethvm terraform | tf [COMMAND]"
  echo ""
  echo "Commands:"
  echo "  install                             Installs Terraform on your system."
  echo "  help                                Print the help information and exit."
  echo ""
}

# terraform_install - Performs an installation of Terraform (TODO: Improve script)
terraform_install() {
  if [ -x "$(command -v terraform)" ]; then
    echo "Terraform is already already installed"
    return 0
  fi

  if [[ "$OSTYPE" == "linux-gnu" ]]; then
    local latest_url=$(curl -sL https://releases.hashicorp.com/terraform/index.json | jq -r '.versions[].builds[].url' | sort -t. -k 1,1n -k 2,2n -k 3,3n -k 4,4n | egrep -v 'rc|alpha|beta' | egrep "$(uname | tr '[:upper:]' '[:lower:]').*amd64" | tail -1)
    curl ${latest_url} > /tmp/terraform.zip
    mkdir -p ${HOME}/bin
    (cd ${HOME}/bin && unzip /tmp/terraform.zip)

    if [[ -z $(grep 'export PATH=${HOME}/bin:${PATH}' ~/.bashrc 2>/dev/null) ]]; then
      echo 'export PATH=${HOME}/bin:${PATH}' >> ~/.bashrc
    fi

    if [[ -z $(grep 'export PATH=${HOME}/bin:${PATH}' ~/.zshrc 2>/dev/null) ]]; then
      echo 'export PATH=${HOME}/bin:${PATH}' >> ~/.zshrc
    fi

    echo "Installed: `$(command -v terraform)`"

      cat - << EOF

Run the following to reload your PATH with terraform:

  source ~/.bashrc  # If using bash
  source ~/.zshrc   # If using zsh

EOF

    elif [[ "$OSTYPE" == "darwin"* ]]; then
    if [ -x "$(command -v brew)" ]; then
      >&2 "In order to install Terraform, brew is needed. More information: https://brew.sh/"
      exit 1
    fi
    echo "Installing terraform using brew..."
    brew install terraform
  else
    echo "Operating System '${OSTYPE}' is not supported for automatic installation of Terraform"
    exit 1
  fi

}

run() {
  local command="${1:-false}"

  case "${command}" in
    install) terraform_install       ;;
    help|*)  terraform_usage; exit 0 ;;
  esac
}
run "$@"
