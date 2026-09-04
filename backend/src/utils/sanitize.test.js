const test = require('node:test');
const assert = require('node:assert/strict');
const { sanitiseText, sanitiseTags, sanitiseFileName } = require('./sanitize');

test('trims text and strips HTML', () => {
  assert.equal(sanitiseText('  <b>Physics</b> notes  '), 'Physics notes');
});

test('parses and de-duplicates tags', () => {
  assert.deepEqual(sanitiseTags('Physics, mechanics, PHYSICS,  '), ['Physics', 'mechanics']);
});

test('strips path fragments from uploaded file names', () => {
  assert.equal(sanitiseFileName('C:\\\\Users\\\\student\\\\paper.pdf'), 'paper.pdf');
  assert.equal(sanitiseFileName('../../secret.exe'), 'secret.exe');
});
