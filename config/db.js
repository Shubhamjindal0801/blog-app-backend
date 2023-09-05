const Mongoose = require('mongoose')
require('dotenv').config()

Mongoose.connect(process.env.MONGODB_URI).then((res)=>{
    console.log('MongoDb Connected')
}).catch((err)=>{
    console.log(err)
})
