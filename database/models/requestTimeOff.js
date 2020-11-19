const mongoose = require('mongoose');
const db = require('../dbConnect');

const requestTimeOffSChema = mongoose.Schema({
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

module.exports = db.model('RequestTimeOff', requestTimeOffSChema)