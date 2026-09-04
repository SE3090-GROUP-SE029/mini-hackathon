const test = require('node:test');
const assert = require('node:assert/strict');
const {
  isAllowedExtension,
  isBlockedExtension,
  matchesFileSignature,
  getFileValidationMessage,
} = require('./fileValidation');

test('accepts supported document extensions', () => {
  assert.equal(isAllowedExtension('notes.pdf'), true);
  assert.equal(isAllowedExtension('paper.DOCX'), true);
  assert.equal(isAllowedExtension('slides.pptx'), true);
});

test('rejects executable and script files', () => {
  assert.equal(isBlockedExtension('setup.exe'), true);
  assert.equal(isBlockedExtension('run.sh'), true);
  assert.equal(isBlockedExtension('hack.bat'), true);
  assert.equal(isAllowedExtension('virus.exe'), false);
});

test('checks PDF magic bytes', () => {
  const pdf = Buffer.from('%PDF-1.4 sample');
  const fake = Buffer.from('not a pdf');
  assert.equal(matchesFileSignature('paper.pdf', pdf), true);
  assert.equal(matchesFileSignature('paper.pdf', fake), false);
});

test('returns a friendly message when no file is selected', () => {
  assert.equal(getFileValidationMessage(null), 'Please upload a PDF or supported document.');
});

test('returns a friendly message for oversized files', () => {
  const message = getFileValidationMessage({
    originalname: 'large.pdf',
    mimetype: 'application/pdf',
    size: 21 * 1024 * 1024,
    buffer: Buffer.from('%PDF-1.4'),
  });
  assert.equal(message, 'File size must be less than 20 MB.');
});
