const mongoose = require('mongoose');

const ShiftSChema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    day: {
        type: Date,
        required: true
    },
    timeBegin: {
        type: Date,
        required: true
    },
    timeEnd: {
        type: Date,
        required: true
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category'
    }
})

module.exports = mongoose.model('Shift', ShiftSChema)