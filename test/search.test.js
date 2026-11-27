import assert from 'node:assert/strict';
import { test } from 'node:test';
import { search } from '../src/search.js';
import { fakeFlags } from './fake-flags.js';

const products = [
  { id: 1, name: 'Trail running shoes' },
  { id: 2, name: 'Running socks' },
  { id: 3, name: 'Rain jacket' },
];

test('fuzzy search matches part of a word', () => {
  const names = search(products, 'run', fakeFlags()).map((p) => p.name);
  assert.deepEqual(names, ['Running socks', 'Trail running shoes']);
});

test('legacy search matches whole words only', () => {
  const flags = fakeFlags({ legacy_search: true });
  assert.deepEqual(search(products, 'run', flags), []);
  assert.equal(search(products, 'rain jacket', flags).length, 1);
});
