const mongoose = require('mongoose');
const db = require('../dbConnect');

const requestTimeOffSChema = mongoose.Schema({
    //_id: mongoose.Schema.Types.ObjectId,
    day: Date,
    timeBegin: Date,
    timeEnd: Date,
    reason: String,
    category: String,
    accepted: Boolean 
})

module.exports = db.model('RequestTimeOff', requestTimeOffSChema)