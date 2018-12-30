#!/bin/bash
set -e

echo "{ \"ServiceEndpoint\": \"$(serverless info --verbose | grep 'Base URL' | sed s/Base\ URL\:\ //g)\" }" > ../frontend/src/stack.json
echo "WebSocket endpoint saved!"

