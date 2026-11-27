const STANDARD_SHIPPING = 4.99;
const FREE_SHIPPING_THRESHOLD = 50;

function subtotalOf(cart) {
  return cart.reduce((sum, item) => sum + item.price * item.qty, 0);
}

function round(n) {
  return Math.round(n * 100) / 100;
}

/**
 * Price a cart. Checkout is one page: review the order, then pay.
 * Address comes from the saved profile.
 */
export function checkout(cart) {
  const subtotal = subtotalOf(cart);
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING;
  return {
    flow: 'one-page',
    steps: ['review', 'pay'],
    subtotal: round(subtotal),
    shipping,
    total: round(subtotal + shipping),
  };
}
