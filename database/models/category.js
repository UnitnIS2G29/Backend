const mongoose = require('mongoose');
const db = require('../dbConnect');

const categorySchema = new mongoose.Schema({
  name: String,
  description: String
})

const Category = db.model('Category', categorySchema);
module.exports = Category;
