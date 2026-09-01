const test = require('node:test');
const assert = require('node:assert/strict');
const { spawnSync } = require('node:child_process');

test('production configuration reads secrets directly from environment variables', () => {
  const script = `
    const runtime = require('./runtime-config');
    process.stdout.write(JSON.stringify({
      mongoURI: runtime.mongoURI,
      jwtSecret: runtime.jwtSecret
    }));
  `;

  const result = spawnSync(process.execPath, ['-e', script], {
    cwd: process.cwd(),
    env: {
      ...process.env,
      NODE_ENV: 'production',
      MONGO_URI: 'mongodb://example.invalid/clearlist',
      JWT_SECRET: 'production-test-secret'
    },
    encoding: 'utf8'
  });

  assert.equal(result.status, 0, result.stderr);

  const values = JSON.parse(result.stdout);

  assert.equal(
    values.mongoURI,
    'mongodb://example.invalid/clearlist'
  );

  assert.equal(
    values.jwtSecret,
    'production-test-secret'
  );
});

test('production server refuses to start without required secrets', () => {
  const result = spawnSync(process.execPath, ['server.js'], {
    cwd: process.cwd(),
    env: {
      ...process.env,
      NODE_ENV: 'production',
      MONGO_URI: '',
      JWT_SECRET: ''
    },
    encoding: 'utf8'
  });

  assert.notEqual(result.status, 0);

  assert.match(
    result.stderr,
    /Missing required production environment variables/
  );
});
