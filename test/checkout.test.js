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

test('free shipping from 50 up', () => {
  assert.equal(checkout([{ price: 50, qty: 1 }]).shipping, 0);
  assert.equal(checkout([{ price: 49.99, qty: 1 }]).shipping, 4.99);
});
