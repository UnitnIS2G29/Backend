const mongoose = require('mongoose');

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

const CheckIn = mongoose.model('CheckIn', CheckInSchema);

module.exports = CheckIn;