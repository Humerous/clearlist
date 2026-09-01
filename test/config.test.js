const test = require('node:test');
const assert = require('node:assert/strict');

const {
  mongoURI,
  jwtSecret,
  isProduction,
} = require('../runtime-config');

test('uses a local database by default', () => {
  if (!isProduction) {
    assert.match(
      mongoURI,
      /^mongodb:\/\/127\.0\.0\.1:/
    );
  }
});

test('provides a local JWT secret outside production', () => {
  if (!isProduction) {
    assert.ok(jwtSecret);
  }
});
