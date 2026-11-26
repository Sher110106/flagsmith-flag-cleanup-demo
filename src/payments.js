/**
 * Kill switch: turning `payments_kill_switch` on stops all card payments,
 * for use during a payment-provider incident.
 */
export function canTakePayments(flags) {
  return !flags.isFeatureEnabled('payments_kill_switch');
}
