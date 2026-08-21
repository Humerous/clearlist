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

mongoose.connect(mongoURI);

const connection = mongoose.connection;

connection.once('open', () => {
  console.log('MongoDB database connection established successfully');
});

connection.on('error', (error) => {
  console.error('MongoDB connection failed:', error.message);
});

app.use('/api/items', require('./routes/api/items'));
app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));

if (isProduction && !process.env.VERCEL) {
  app.use(express.static('client/dist'));

  app.get('*', (req, res) => {
    res.sendFile(
      path.resolve(__dirname, 'client', 'dist', 'index.html')
    );
  });
}

const port = process.env.PORT || 5050;

if (!process.env.VERCEL) {
  app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
  });
}

module.exports = app;
