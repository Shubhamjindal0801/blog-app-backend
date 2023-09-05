const Mongoose = require('mongoose')
const Schema = Mongoose.Schema

const FollowSchema = new Schema({
    followerUserId: {
        type: String,
        ref: "users",
        require: true
    },
    // followerName:{
    //     type:String,
    // },
    followingUserId: {
        type: String,
        ref: "users",
        require: true
    },
    // followingName:{
    //     type:String
    // },
    creationDateAndTime: {
        type: Date,
        default: Date.now(),
        require: true
    }
},
    {
        strict: false
    }
)

module.exports = Mongoose.model('follow', FollowSchema)