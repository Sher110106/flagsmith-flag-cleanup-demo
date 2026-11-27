#!/usr/bin/env bash
# Put the demo back as it was before a cleanup run: return to main and drop
# local flag-cleanup branches.
# Usage: scripts/reset-demo.sh
set -euo pipefail

cd "$(dirname "$0")/.."
git switch -q main
git reset -q --hard origin/main 2>/dev/null || git reset -q --hard
for b in $(git branch --list 'flag-cleanup/*' --format='%(refname:short)'); do
  git branch -q -D "$b" && echo "deleted branch $b"
done
rm -rf .flag-cleanup
echo "demo reset"
