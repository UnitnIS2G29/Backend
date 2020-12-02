const express = require('express');
const { check, validationResult } = require('express-validator');

const router = express.Router();

const User = require('../database/models/user');

const auth = require('../middlewares/auth');


// Retrieve the information of the logged user

router.get('/', auth(), (req, res) => {
  try {
    return res.send(req.user);
  } catch (e) {
    return res.status(500).send(e)
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
      const user = await User.findOne({email: req.body.email}).exec();
      if(!user) {
        return res.status(404).send(new Error("User not found"));
      }

      if(user.password == req.body.password) {
        const token = await user.generateToken();
        return res.status(200).send({user, token});
      }
      return res.status(401).send();
    } catch(e) {
      console.log(e);
      return res.status(500).send(e);
    }
})

module.exports = router;

