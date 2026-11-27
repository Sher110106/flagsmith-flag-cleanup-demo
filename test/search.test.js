import assert from 'node:assert/strict';
import { test } from 'node:test';
import { search } from '../src/search.js';

const products = [
  { id: 1, name: 'Trail running shoes' },
  { id: 2, name: 'Running socks' },
  { id: 3, name: 'Rain jacket' },
];

test('fuzzy search matches part of a word', () => {
  const names = search(products, 'run').map((p) => p.name);
  assert.deepEqual(names, ['Running socks', 'Trail running shoes']);
});
