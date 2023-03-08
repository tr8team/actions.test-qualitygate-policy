#!/usr/bin/env bash

set -eou pipefail

PATH="$(pwd)/node_modules/.bin:$PATH"
pnpm i
pre-commit install -c ./config/.pre-commit-config.yaml --install-hooks
pre-commit run -c ./config/.pre-commit-config.yaml --all
