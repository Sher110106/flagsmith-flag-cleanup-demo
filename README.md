# flagsmith-flag-cleanup demo shop

A tiny shop API with seven Flagsmith flags in different states. It is the test bed for the [flagsmith-flag-cleanup](https://github.com/Sher110106/flagsmith-flag-cleanup) agent skill, and the pull requests in this repo were opened by that skill.

| Flag | State in Flagsmith | What the skill should do |
|---|---|---|
| `new_checkout_flow` | on everywhere | remove; keep the one-page checkout |
| `legacy_search` | off everywhere | remove; keep fuzzy search |
| `free_shipping_threshold` | value `50` everywhere | remove; inline `50` |
| `promo_banner_2025` | on everywhere, no code reads it | archive only |
| `dark_mode` | segment override in Production | keep |
| `payments_kill_switch` | permanent tag | keep |
| `recommendations_v2` | off in Production only | keep |
| `gift_cards` | read in code, not in Flagsmith | report |

## Run it

```sh
npm install
npm test                       # no Flagsmith needed: tests use a fake flags object
FLAGSMITH_SERVER_KEY=ser.xxx npm start
```

## Make your own copy of the Flagsmith project

```sh
flagsmith login
scripts/seed-flagsmith.sh "<your organisation>"   # creates the project, environments and flags
scripts/reset-demo.sh                              # after a cleanup run: unarchive flags, back to main
```
