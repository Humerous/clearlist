const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');

const model = fs.readFileSync('models/Item.js', 'utf8');
const routes = fs.readFileSync('routes/api/items.js', 'utf8');
const store = fs.readFileSync('client/src/app/store.js', 'utf8');

test('tasks require an owning user', () => {
  assert.match(model, /Schema\.Types\.ObjectId/);
  assert.match(model, /ref: 'user'/);
  assert.match(model, /required: true/);
});

test('task listing requires authentication and filters by owner', () => {
  assert.match(routes, /router\.get\('\/', auth/);
  assert.match(routes, /Item\.find\(\{ user: req\.user\.id \}\)/);
});

test('new tasks are assigned to the authenticated user', () => {
  assert.match(routes, /user: req\.user\.id/);
});

test('deletion checks both task id and authenticated owner', () => {
  assert.match(routes, /_id: req\.params\.id/);
  assert.match(routes, /user: req\.user\.id/);
});

test('modern frontend sends authentication when loading tasks', () => {
  assert.match(store, /\/api\/items/);
  assert.match(store, /authHeaders\(getState\(\)\.auth\.token\)/);
});
