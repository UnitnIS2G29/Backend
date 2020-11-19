const mongoose = require('mongoose');
const db = require('../dbConnect');

const CheckInSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    entrance: {
        time: Date,
        expiry: Date
    }
})

const CheckIn = db.model('CheckIn', CheckInSchema);

module.exports = CheckIn;