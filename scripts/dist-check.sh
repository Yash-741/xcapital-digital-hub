#!/usr/bin/env bash
# Wrap `vite build` with one retry on transient failures.
# On final failure, print Vite build output path and environment details.
set -u

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT_DIR"

LOG_DIR="${ROOT_DIR}/.dist-check"
mkdir -p "$LOG_DIR"

run_build() {
  local attempt="$1"
  local log="${LOG_DIR}/attempt-${attempt}.log"
  echo "[dist-check] attempt ${attempt}: vite build"
  if vite build 2>&1 | tee "$log"; then
    return 0
  fi
  return 1
}

print_diagnostics() {
  echo ""
  echo "=============================================="
  echo "[dist-check] BUILD FAILED — diagnostics"
  echo "=============================================="
  echo "Vite build output dir: ${ROOT_DIR}/dist"
  if [ -d "${ROOT_DIR}/dist" ]; then
    echo "dist/ contents:"
    ls -la "${ROOT_DIR}/dist" 2>&1 | sed 's/^/  /'
  else
    echo "dist/ does not exist."
  fi
  echo ""
  echo "Environment:"
  echo "  node:    $(node --version 2>/dev/null || echo 'not found')"
  echo "  bun:     $(bun --version 2>/dev/null || echo 'not found')"
  echo "  npm:     $(npm --version 2>/dev/null || echo 'not found')"
  echo "  vite:    $(vite --version 2>/dev/null || echo 'not found')"
  echo "  os:      $(uname -a)"
  echo "  cwd:     ${ROOT_DIR}"
  echo "  NODE_ENV=${NODE_ENV:-<unset>}"
  echo "  CI=${CI:-<unset>}"
  echo "  memory:  $(free -h 2>/dev/null | awk '/Mem:/ {print $2" total, "$7" available"}' || echo 'n/a')"
  echo "  disk:    $(df -h "${ROOT_DIR}" | awk 'NR==2 {print $4" free of "$2}')"
  echo ""
  echo "Logs: ${LOG_DIR}/"
  ls -la "$LOG_DIR" 2>&1 | sed 's/^/  /'
  echo "=============================================="
}

if run_build 1; then
  exit 0
fi

echo "[dist-check] attempt 1 failed; retrying once..."
sleep 1

if run_build 2; then
  echo "[dist-check] succeeded on retry."
  exit 0
fi

print_diagnostics
exit 1