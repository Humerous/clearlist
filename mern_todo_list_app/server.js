const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const path = require('path');
const config = require('config');

const app = express();

// <--- MIDDLEWARE --->
app.use(express.json());
app.use(morgan('dev'));

//<--- DB CONFIG --->
const isProduction = process.env.NODE_ENV === 'production';

if (isProduction) {
  const missing = ['MONGO_URI', 'JWT_SECRET'].filter(
    (name) => !process.env[name]
  );

  if (missing.length) {
    console.error(
      `Missing required production environment variables: ${missing.join(', ')}`
    );
    process.exit(1);
  }
}

const db = config.get('mongoURI');

//<--- ATLAS_MONGO_URI IS FOR THE CLOUD DATABASE - stored in a .env file --->//
mongoose.connect(db);

const connection = mongoose.connection;
connection.once('open', () => {
  console.log('MongoDB database connection established successfully');
});

// <--- ROUTE BELOW --->
app.use('/api/items', require('./routes/api/items'));
app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));

//<--- SERVE STATIC ASSERTS IF IN PRODUCTION --->
if (isProduction) {
  //<--- SET STATIC FOLDER --->
  app.use(express.static('client/dist'));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'dist', 'index.html'));
  });
}

//<--- PORT LISTENING ON PORT 5000 --->//
const port = process.env.PORT || 5050;
connection.on('error', (error) => {
  console.error('MongoDB connection failed:', error.message);
});

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
