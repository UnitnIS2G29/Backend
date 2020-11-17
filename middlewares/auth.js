const JWT = require('jsonwebtoken');
const User = require('../database/models/user');

const auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace('Bearer ', '');
    const data = JWT.verify(token, process.env.AUTHKEY);
    const user = await User.findOne({_id: data.id, 'tokens.token': token});

    if(!user)
      res.status(401).send(new Error("Not Authorized User"));

    req.user = user;

    next();

  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
}

module.exports = auth;
