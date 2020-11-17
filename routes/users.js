const express = require('express');
const { check, body, validationResult } = require('express-validator');
const _ = require('lodash');
const router = express.Router();

const { Roles } = require('../utils/roles');

const User = require("../database/models/user");

router.get('/', async (req, res) => {
  try {
    const users = await User.find();

    if(!users.length) {
      res.status(404).send(new Error("No user found"));
    } else {
      res.status(200).send(users);
    }

  } catch (e) {
    res.status(500).send(e);
  }
})

router.post('/',
  [
    check('name').not().isEmpty(),
    check('email').isEmail().normalizeEmail(),
    check('role').isIn(Roles),
    check('password')
      .not().isEmpty()
      .isLength({min: 5})
  ],
  async (req, res) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    let user = new User(
      _.pick(req.body, ['name','role', 'email','password'])
    );

    user = await user.save();

    res.status(201).send(user);

  } catch (e) {
    res.status(500).send(e);
  }
})

router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if(!user) {
      res.status(400).send(new Error("Invalid Id"));
    }

    res.send(user);
  } catch (e) {
    res.status(500).send(e);
  }
})

router.put('/:id',
  [
    body('email').isEmail().normalizeEmail(),
    body('role').isIn(Roles),
    body('password')
      .isLength({min: 5})
  ],
  async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    let user = await User.findById(req.params.id);

    if(!user) {
      res.status(400).send(new Error("Invalid Id"));
    }

    let bodyuser = _.pick(req.body, ["name", "role", "email", "password"]);
    user = _.merge(user, bodyuser);
    user = await user.save();

    res.send(user);
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
})

router.delete('/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if(!user) {
      res.status(400).send(new Error("Invalid Id"));
    }

    res.send(user);
  } catch (e) {
    res.status(500).send(e);
  }
})

module.exports = router;
