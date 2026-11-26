import assert from 'node:assert/strict';
import { test } from 'node:test';
import { checkout } from '../src/checkout.js';
import { fakeFlags } from './fake-flags.js';

const cart = [{ price: 20, qty: 2 }];

test('one-page checkout when new_checkout_flow is on', () => {
  const result = checkout(cart, fakeFlags({ new_checkout_flow: true }));
  assert.equal(result.flow, 'one-page');
  assert.deepEqual(result.steps, ['review', 'pay']);
  assert.equal(result.total, 44.99);
});

test('multi-page checkout when new_checkout_flow is off', () => {
  const result = checkout(cart, fakeFlags({ new_checkout_flow: false }));
  assert.equal(result.flow, 'multi-page');
  assert.equal(result.steps.length, 5);
  assert.equal(result.total, 45.49);
});

test('free shipping above the threshold from free_shipping_threshold', () => {
  const flags = fakeFlags({ new_checkout_flow: true, free_shipping_threshold: { value: 40 } });
  assert.equal(checkout(cart, flags).shipping, 0);
});

test('free shipping threshold falls back to 75', () => {
  const big = [{ price: 80, qty: 1 }];
  assert.equal(checkout(big, fakeFlags({ new_checkout_flow: true })).shipping, 0);
  assert.equal(checkout(cart, fakeFlags({ new_checkout_flow: true })).shipping, 4.99);
});
