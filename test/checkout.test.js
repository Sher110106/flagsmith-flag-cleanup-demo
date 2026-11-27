import assert from 'node:assert/strict';
import { test } from 'node:test';
import { checkout } from '../src/checkout.js';

const cart = [{ price: 20, qty: 2 }];

test('one-page checkout', () => {
  const result = checkout(cart);
  assert.equal(result.flow, 'one-page');
  assert.deepEqual(result.steps, ['review', 'pay']);
  assert.equal(result.total, 44.99);
});

test('free shipping from 50', () => {
  assert.equal(checkout([{ price: 25, qty: 2 }]).shipping, 0);
  assert.equal(checkout(cart).shipping, 4.99);
});
