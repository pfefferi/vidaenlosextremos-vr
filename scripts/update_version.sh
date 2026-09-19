#!/usr/bin/env bash
# Portable replacement for update_version.ps1.
# Writes data/version.json as UTF-8 WITHOUT a BOM
# (unlike Out-File -Encoding utf8 on Windows PowerShell 5.1).
set -euo pipefail

cd "$(dirname "$0")/.."

if ! command -v git >/dev/null 2>&1; then
    echo "error: git is required" >&2
    exit 1
fi

msg=$(git log -1 --pretty=format:%s)
hash=$(git log -1 --pretty=format:%h)
date=$(date +"%Y-%m-%d %H:%M:%S")

cat > data/version.json <<EOF
{
    "message":  "$msg",
    "timestamp":  "$date",
    "hash":  "$hash"
}
EOF

echo "Build Base Hash set to: $hash ($msg)"
