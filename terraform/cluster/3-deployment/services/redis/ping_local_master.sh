#!/bin/sh

script_dir="$(dirname "$0")"

exit_status=0

"$script_dir/ping_local.sh" || exit_status=$?
"$script_dir/ping_master.sh" || exit_status=$?

exit $exit_status
