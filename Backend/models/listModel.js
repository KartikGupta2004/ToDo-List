const mongoose = require('mongoose')

const Schema = mongoose.Schema

const stepSchema = new Schema({
    text: {
        type: String,
        required: true
    },
    completed: {
        type: Boolean,
        default: false
    }
});

const listSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    dueDate: {
        type: Date,
        required: true
    },
    note: {
        type: String
    },
    steps: [stepSchema],
    user_id: {
        type: String,
        required: true
    }
},{timestamps:true})
module.exports=mongoose.model('List',listSchema);