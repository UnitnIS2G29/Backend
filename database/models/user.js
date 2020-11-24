const mongoose = require('mongoose');
const JWT = require('jsonwebtoken');

const UserSchema = new mongoose.Schema({
  name: String,
  email: {
    type: String,
    unique: true,
    required: true
  },
  role: {
    type: String,   // ['employee', 'supervisor', 'admin']
    required: true
  },
  password: String,
  tokens: [
    {
      token: {
        type: String,
        required: true
      },
      date: {
        type: Date,
        required: true
      }
    }
  ]
})

// Generate token with role and id of user

UserSchema.methods.generateToken = async function() {
  const user = this;
  const token = JWT.sign({id: user._id, role: user.role}, process.env.AUTHKEY);
  user.tokens = user.tokens.concat({token, date: new Date() });
  await user.save();
  return token;
}

const User = mongoose.model('User', UserSchema);

module.exports = User;
