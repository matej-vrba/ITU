#!/usr/bin/env bash

function check_cmd {
if ! command -v $1 &> /dev/null
then
    echo "$1 not found"
    exit 1
fi
}
check_cmd npx
check_cmd python
check_cmd pip

(cd backend && ./setup.sh)
(cd frontend && ./setup.sh)
