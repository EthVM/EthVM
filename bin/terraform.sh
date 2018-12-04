#!/usr/bin/env bash

set -o errexit
set -o nounset
# set -o xtrace
# set -o verbose

# Give script sane defaults
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

terraform_install() {
    [[ -f ${HOME}/bin/terraform ]] && echo "`${HOME}/bin/terraform version` already installed at ${HOME}/bin/terraform" && return 0
    local latest_url=$(curl -sL https://releases.hashicorp.com/terraform/index.json | jq -r '.versions[].builds[].url' | sort -t. -k 1,1n -k 2,2n -k 3,3n -k 4,4n | egrep -v 'rc|alpha|beta' | egrep "$(uname | tr '[:upper:]' '[:lower:]').*amd64" |tail -1)
    curl ${latest_url} > /tmp/terraform.zip
    mkdir -p ${HOME}/bin
    (cd ${HOME}/bin && unzip /tmp/terraform.zip)
    if [[ -z $(grep 'export PATH=${HOME}/bin:${PATH}' ~/.bashrc 2>/dev/null) ]]; then
        echo 'export PATH=${HOME}/bin:${PATH}' >> ~/.bashrc
    fi

    echo "Installed: `${HOME}/bin/terraform version`"

  cat - << EOF

Run the following to reload your PATH with terraform:

  source ~/.bashrc

EOF
}

run() {
    local command="${1:-false}"

    case "${command}" in
        install) terraform_install   ;;
        help|*)  kafka_usage; exit 0 ;;
    esac
}
run "$@"
