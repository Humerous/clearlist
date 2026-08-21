const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../../runtime-config');

//<--- USER MODEL --->
const User = require('../../models/User');

//<--- POST ROUTE--->
router.post('/', (req, res) => {
  const { name, email, password } = req.body;

  //<--- SIMPLE VALIDATION --->
  if (!name || !email || !password) {
    return res.status(400).json({ msg: 'Please enter all fields' });
  }

  //<--- CHECK FOR EXSITING USER --->
  User.findOne({ email: email }).then((user) => {
    if (user) return res.status(400).json({ msg: 'User already exists' });
    const newUser = new User({
      name,
      email,
      password,
    });

    //<--- CREATE SALT & HATCH --->
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(newUser.password, salt, (err, hash) => {
        if (err) throw err;
        newUser.password = hash;
        newUser.save().then((user) => {
          jwt.sign(
            { id: user.id },
            jwtSecret,
            { expiresIn: 3600 },
            (err, token) => {
              if (err) throw err;
              res.json({
                token,
                user: {
                  id: user.id,
                  name: user.name,
                  email: user.email,
                },
              });
            }
          );
        });
      });
    });
  });
});

module.exports = router;
