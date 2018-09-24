#!/bin/bash -e

if [ -n "`$SHELL -c 'echo $ZSH_VERSION'`" ]; then
SCRIPT_DIR="$( cd "$( dirname "${(%):-%x}" )" && pwd )"
elif [ -n "`$SHELL -c 'echo $BASH_VERSION'`" ]; then
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
fi

exec yarn monkey $@
