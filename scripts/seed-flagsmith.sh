#!/usr/bin/env bash
# Create the demo-shop Flagsmith project: 3 environments, 7 flags in different states.
# Usage: scripts/seed-flagsmith.sh ORGANISATION   (id or name; see `flagsmith organisation list`)
# Needs `flagsmith login` first. Writes flagsmith.json in the repo root.
set -euo pipefail

org=${1:?usage: seed-flagsmith.sh ORGANISATION}
cd "$(dirname "$0")/.."
fs() { flagsmith --no-input "$@"; }

project=$(fs project create demo-shop --organisation "$org" --json --jq .id)
for env in Development Staging Production; do
  fs environment create "$env" -p "$project" >/dev/null
done
dev=$(fs environment list -p "$project" --jq '.[] | select(.name == "Development") | .api_key')
prod=$(fs environment list -p "$project" --jq '.[] | select(.name == "Production") | .api_key')
fs init -p "$project" -e "$dev" >/dev/null

# Settled: same everywhere, safe to remove.
fs feature create new_checkout_flow --enabled --description "One-page checkout (rolled out to everyone)"
fs feature create legacy_search --description "Old whole-word search (switched off)"
fs feature create free_shipping_threshold --enabled --value 50 --description "Order total for free shipping"
# Settled, and no code reads it.
fs feature create promo_banner_2025 --enabled --value "Holiday sale" --description "2025 holiday banner"
# Still doing work: a segment override, a permanent tag, a rollout in progress.
fs feature create dark_mode --description "Dark theme, beta testers only"
fs feature create payments_kill_switch --description "Stops card payments during an incident"
fs feature create recommendations_v2 --enabled --description "New recommendation model, rolling out"

fs segment create beta_testers --description "Shoppers in the beta programme" \
  --rules '{"type":"ALL","rules":[{"type":"ANY","conditions":[{"property":"beta","operator":"EQUAL","value":"true"}]}]}'
fs flag update dark_mode --enable --segment beta_testers -e "$prod" --yes >/dev/null
fs flag update recommendations_v2 --disable -e "$prod" --yes >/dev/null

tag=$(fs api "api/v1/projects/$project/tags/" -f label=kill-switch -f color='#E5534B' -F is_permanent=true --jq .id)
kill=$(fs feature get payments_kill_switch --jq .id)
echo "{\"tags\":[$tag]}" | fs api "api/v1/projects/$project/features/$kill/" -X PATCH --input - >/dev/null

echo "Seeded project demo-shop ($project). Try: flagsmith flag list"
