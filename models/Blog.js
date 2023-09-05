const Mongoose = require('mongoose')
const Schema = Mongoose.Schema

const Blog = new Schema({
    title: {
        type: String,
        required: true
    },
    textBody: {
        type: String,
        required: true,
    },
    creationDateAndTime: {
        type: Date,
        default: Date.now(),
        required: true,
    },
    userId: {
        type: String,
        required:true
    },
    username:{
        type:String,
        require:true
    },
    isDeleted:{
        type:Boolean,
        require:true,
        default:false
    },
    deletionDateTime:{
        type:Date,
        require:false
    }
},
)

module.exports = Mongoose.model('blogs', Blog)