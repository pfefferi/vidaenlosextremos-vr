#!/usr/bin/env bash
# update_version.sh — Update data/version.json to match current git HEAD
# Usage: bash scripts/update_version.sh

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
VERSION_FILE="$PROJECT_DIR/data/version.json"

cd "$PROJECT_DIR"

HASH=$(git rev-parse --short HEAD)
TIMESTAMP=$(git show -s --format=%ci HEAD)
MESSAGE=$(git log -1 --format=%s HEAD)

cat > "$VERSION_FILE" <<EOF
{
    "message": "$MESSAGE",
    "timestamp": "$TIMESTAMP",
    "hash": "$HASH"
}
EOF

echo "version.json updated: $HASH — $MESSAGE"
