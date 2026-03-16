#!/usr/bin/env bash
set -euo pipefail

export BUN_INSTALL="$HOME/.bun"
export PATH="$BUN_INSTALL/bin:$PATH"
export EMAIL_VERIFY_API_KEY="sniff_WhIOo6m799zWNvY4vXPl76pfR-PpgF3r"
export EMAIL_VERIFY_API_URL="https://api.sniffmail.io/verify"

cd "$(dirname "$0")"
bun run dev -- --host 0.0.0.0 --port 3000
