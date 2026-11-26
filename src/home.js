/** Build the home page model for one shopper. */
export function renderHome(user, flags) {
  const sections = ['hero'];

  if (flags.isFeatureEnabled('recommendations_v2')) {
    sections.push('recommendations-v2');
  } else {
    sections.push('recommendations');
  }

  if (flags.isFeatureEnabled('gift_cards')) {
    sections.push('gift-cards');
  }

  return {
    greeting: `Welcome back, ${user.name}`,
    theme: flags.isFeatureEnabled('dark_mode') ? 'dark' : 'light',
    sections,
  };
}
