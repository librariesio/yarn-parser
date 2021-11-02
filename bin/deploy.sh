#!/bin/bash

set -e

REVISION=$(git show-ref origin/main |cut -f 1 -d ' ')
TAGGED_IMAGE=gcr.io/${GOOGLE_PROJECT}/yarn-parser:${REVISION}

gcloud --quiet container images describe ${TAGGED_IMAGE} || { status=$?; echo "Container not finished building" >&2; exit $status; }

gcloud --quiet container images add-tag ${TAGGED_IMAGE} gcr.io/${GOOGLE_PROJECT}/yarn-parser:latest

kubectl set image deployment/yarn-parser yarn-parser-container=${TAGGED_IMAGE}


