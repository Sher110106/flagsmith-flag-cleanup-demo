const STANDARD_SHIPPING = 4.99;

function subtotalOf(cart) {
  return cart.reduce((sum, item) => sum + item.price * item.qty, 0);
}

function round(n) {
  return Math.round(n * 100) / 100;
}

/**
 * Price a cart and pick the checkout steps the shopper walks through.
 * `flags` is a Flagsmith Flags object (or anything with the same two methods).
 */
export function checkout(cart, flags) {
  const subtotal = subtotalOf(cart);
  const threshold = Number(flags.getFeatureValue('free_shipping_threshold') ?? 75);
  const shipping = subtotal >= threshold ? 0 : STANDARD_SHIPPING;

  if (flags.isFeatureEnabled('new_checkout_flow')) {
    return newCheckout(subtotal, shipping);
  }
  return legacyCheckout(subtotal, shipping);
}

// One page: review the order, then pay. Address comes from the saved profile.
function newCheckout(subtotal, shipping) {
  return {
    flow: 'one-page',
    steps: ['review', 'pay'],
    subtotal: round(subtotal),
    shipping,
    total: round(subtotal + shipping),
  };
}

// The old five-page flow, kept until the one-page flow proved itself.
function legacyCheckout(subtotal, shipping) {
  const steps = ['cart', 'address', 'shipping', 'review', 'pay'];
  const handlingFee = 0.5;
  return {
    flow: 'multi-page',
    steps,
    subtotal: round(subtotal),
    shipping: shipping === 0 ? 0 : round(shipping + handlingFee),
    total: round(subtotal + (shipping === 0 ? 0 : shipping + handlingFee)),
  };
}
