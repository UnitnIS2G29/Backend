const mongoose = require('mongoose');

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

const Department = mongoose.model('Department', departmentSchema);
module.exports = Department;
