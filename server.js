const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const path = require('path');

const {
  isProduction,
  mongoURI,
  assertProductionConfig,
} = require('./runtime-config');

const app = express();

app.use(express.json());
app.use(morgan('dev'));

assertProductionConfig();

mongoose
  .connect(mongoURI, {
    serverSelectionTimeoutMS: 10000,
  })
  .then(() => {
    console.log('MongoDB database connection established successfully');
  })
  .catch((error) => {
    console.error('MongoDB connection failed:', error.message);
  });

app.use('/api/items', require('./routes/api/items'));
app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));

if (isProduction) {
  const staticDirectory = process.env.VERCEL
    ? path.join(__dirname, 'public')
    : path.join(__dirname, 'client', 'dist');

  app.use(express.static(staticDirectory));

  app.get('*', (req, res) => {
    res.sendFile(path.join(staticDirectory, 'index.html'));
  });
}

const port = process.env.PORT || 5050;

if (!process.env.VERCEL) {
  app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
  });
}

module.exports = app;
