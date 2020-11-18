const JWT = require('jsonwebtoken');
const User = require('../database/models/user');

// Middleware for authentication

const auth = (role) => async (req, res, next) => {
  if(process.env.DISABLEAUTH == "true") {
    next();
  } else {
    try {
      if(!req.header("Authorization"))
        throw new Error("No token received");

      const token = req.header("Authorization").replace('Bearer ', '');
      const data = JWT.verify(token, process.env.AUTHKEY);                    // Decrypt the token received
      const user = await User.findOne({_id: data.id, 'tokens.token': token}); // Find user with id find in token and active token

        console.log(role);
        console.log(data.role);

      if((role == "supervisor" && data.role == "employee") || (role == "admin" && (data.role == "employee" || data.role == "supervisor")) || !user )
        throw new Error("Not Authorized User");

      req.user = user;

      next();

    } catch (e) {
      console.log(e);
      res.status(401).send(e);
    }
  }
}

module.exports = auth;
