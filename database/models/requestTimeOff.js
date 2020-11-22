const mongoose = require('mongoose');

const requestTimeOffSChema = mongoose.Schema({
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
    reason: String,
    category: {
        type: String,
        required:true
    },
    accepted: Boolean 
})

module.exports = mongoose.model('RequestTimeOff', requestTimeOffSChema)