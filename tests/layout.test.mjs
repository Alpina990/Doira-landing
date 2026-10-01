import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const page = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const cssBlock = selector => {
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const match = page.match(new RegExp(`${escaped}\\s*\\{([^}]+)\\}`));
  assert.ok(match, `${selector} CSS rule must exist`);
  return match[1];
};

test('Boshlash button is a proportional 130% version of the source button', () => {
  const button = cssBlock('.btn');
  assert.match(button, /gap:\s*13px/);
  assert.match(button, /padding:\s*16\.9px 36\.4px/);
  assert.match(button, /font:\s*600 20\.8px\/1 var\(--f\)/);
  assert.doesNotMatch(button, /\bwidth:/);
  assert.doesNotMatch(button, /min-height:/);

  const icon = cssBlock('.btn svg');
  assert.match(icon, /width:\s*22\.1px/);
  assert.match(icon, /height:\s*22\.1px/);
});

test('large-screen scale is derived from the real layout size', () => {
  assert.doesNotMatch(page, /inner(?:Width|Height)\s*\/\s*800/);
  assert.match(page, /unscaledHeight/);
  assert.match(page, /document\.body\.scrollHeight/);
  assert.match(page, /Math\.min\(widthScale, heightScale\)/);
  assert.match(page, /document\.fonts\.ready/);
});
