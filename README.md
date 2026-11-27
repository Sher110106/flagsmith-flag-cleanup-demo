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

The setup scripts live in the skill repo, so the only code here that names the flags is the app itself.

```sh
flagsmith login
git clone https://github.com/Sher110106/flagsmith-flag-cleanup
flagsmith-flag-cleanup/demo/seed-flagsmith.sh "<your organisation>" .   # project, environments, flags
flagsmith-flag-cleanup/demo/reset-demo.sh .                             # after a run: unarchive, back to main
```
