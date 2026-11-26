import { DefaultFlag, Flagsmith } from '@flagsmith/nodejs';

// One client per process. Local evaluation keeps flag checks off the network;
// it needs a server-side environment key.
const flagsmith = process.env.FLAGSMITH_SERVER_KEY
  ? new Flagsmith({
      environmentKey: process.env.FLAGSMITH_SERVER_KEY,
      enableLocalEvaluation: true,
      environmentRefreshIntervalSeconds: 15,
      // If Flagsmith is unreachable, every flag reads as off with no value.
      defaultFlagHandler: () => new DefaultFlag(null, false),
    })
  : null;

const offline = {
  isFeatureEnabled: () => false,
  getFeatureValue: () => null,
};

/** Flags for one shopper, with segment overrides applied. */
export async function flagsFor(userId) {
  if (!flagsmith) return offline;
  return flagsmith.getIdentityFlags(userId);
}

export async function closeFlags() {
  await flagsmith?.close();
}
