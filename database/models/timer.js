const mongoose = require('mongoose');
const db = require('../dbConnect');

const TimerSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    started_at: {
        type: Date,
        required: true
    },
    stopped_at: Date,
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
    },
    description: String
},{
    timestamps:{
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
});

const Timer = db.model('Timer', TimerSchema);

module.exports = Timer;