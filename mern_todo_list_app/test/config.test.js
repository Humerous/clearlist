const test = require('node:test');
const assert = require('node:assert/strict');
const config = require('config');

test('uses a local database by default', () => {
  assert.match(config.get('mongoURI'), /^mongodb:\/\/127\.0\.0\.1:/);
});

test('supports environment-based production secrets', () => {
  assert.equal(
    config.util.getEnv('NODE_ENV'),
    process.env.NODE_ENV || 'development'
  );
  assert.ok(config.get('jwtSecret'));
});
