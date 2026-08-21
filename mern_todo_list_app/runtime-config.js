const isProduction = process.env.NODE_ENV === 'production';

const mongoURI =
  process.env.MONGO_URI ||
  (isProduction
    ? ''
    : 'mongodb://127.0.0.1:27017/mern_todo_list_app');

const jwtSecret =
  process.env.JWT_SECRET ||
  (isProduction
    ? ''
    : 'local-dev-jwt-secret-change-for-production');

function assertProductionConfig() {
  if (!isProduction) return;

  const missing = [];

  if (!process.env.MONGO_URI) missing.push('MONGO_URI');
  if (!process.env.JWT_SECRET) missing.push('JWT_SECRET');

  if (missing.length) {
    throw new Error(
      `Missing required production environment variables: ${missing.join(', ')}`
    );
  }
}

module.exports = {
  isProduction,
  mongoURI,
  jwtSecret,
  assertProductionConfig,
};
