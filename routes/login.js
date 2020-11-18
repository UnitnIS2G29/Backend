const express = require('express');
const { check, validationResult } = require('express-validator');

const router = express.Router();

const User = require('../database/models/user');

const auth = require('../middlewares/auth');


// Retrieve the information of the logged user

router.get('/', auth(), (req, res) => {
  try {
    res.send(req.user);
  } catch (e) {
    res.status(500).send(e)
  }
})

// Login endpoint

router.post('/', [
    check('email').not().isEmpty(),
    check('password').not().isEmpty()
  ], async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    console.log("Logging in");
    try {
      console.log("Retrieving User");
      console.log(req.body);
      const user = await User.findOne({name: req.body.name}).exec();
      console.log(user);
      if(!user) {
        res.status(404).send(new Error("User not found"));
      }
      console.log(user);

      if(user.password == req.body.password) {
        const token = user.generateToken();
        res.status(200).send({user, token});
      }

    } catch(e) {
      console.log(e);
      res.status(500).send(e);
    }
})

module.exports = router;

