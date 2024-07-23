const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Create schema, schema is data structure
const taskSchema = new Schema({
    taskName: {
        type: String,
        require: true
    },
    taskGroup: {
        type: String,
        require: true
    },
    dueDate: {
        type: Date,
        require: true
    },
    status: {
        type: String,
        require: true
    }
}, { timestamps: true })

//Create and export model
const Task = mongoose.model('Task', taskSchema);
module.exports = Task;