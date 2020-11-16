const mongoose = require('mongoose');
const db = require('../dbConnect');

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

const User = db.model('User', UserSchema);

module.exports = User;
