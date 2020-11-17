const express = require('express');
const { check, validationResult } = require('express-validator');

const router = express.Router();



router.get('/', (req, res) => {
  try {
    res.send(req.user);
  } catch (e) {
    res.status(500).send(e)
  }
})

router.post('/', [
    check('email').not().isEmpty(),
    check('password').not().isEmpty()
  ], async (req, res) => {
    try {
      const user = await User.find({email: req.body.email});
      if(!user) {
        res.status(404).send(new Error("User not found"));
      }

      if(user.passord == password) {
        const token = user.generateToken();
        res.statu(200).send({user, token});
      }

    } catch(e) {
      res.status(500).send(e);
    }
})

module.exports = router;

