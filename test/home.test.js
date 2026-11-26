import assert from 'node:assert/strict';
import { test } from 'node:test';
import { renderHome } from '../src/home.js';
import { canTakePayments } from '../src/payments.js';
import { fakeFlags } from './fake-flags.js';

test('home page uses the flags for theme and sections', () => {
  const page = renderHome({ name: 'Ada' }, fakeFlags({ dark_mode: true, recommendations_v2: true }));
  assert.equal(page.theme, 'dark');
  assert.deepEqual(page.sections, ['hero', 'recommendations-v2']);
});

test('home page defaults', () => {
  const page = renderHome({ name: 'Ada' }, fakeFlags());
  assert.equal(page.theme, 'light');
  assert.deepEqual(page.sections, ['hero', 'recommendations']);
});

test('payments kill switch', () => {
  assert.equal(canTakePayments(fakeFlags()), true);
  assert.equal(canTakePayments(fakeFlags({ payments_kill_switch: true })), false);
});
