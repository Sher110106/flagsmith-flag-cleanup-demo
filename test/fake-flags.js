/** A stand-in for a Flagsmith Flags object: { name: true | false | { value } }. */
export function fakeFlags(state = {}) {
  return {
    isFeatureEnabled: (name) => Boolean(state[name]),
    getFeatureValue: (name) => (typeof state[name] === 'object' ? state[name].value : null),
  };
}
