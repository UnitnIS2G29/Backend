const mongoose = require('mongoose');
const db = require('../dbConnect');

const departmentSchema = new mongoose.Schema({
    name: String,
    description: String,    
    employees: [
        {
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            }
        }
    ]
})

const Department = db.model('Category', departmentSchema);
module.exports = Department;
