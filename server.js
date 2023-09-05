const express = require('express')
require('dotenv').config()
const userRoutes = require('./routes/userRoutes')
const blogRoutes = require('./routes/blog')
const followRoutes = require('./routes/follow')
const session = require('express-session')
const MongoDbSession = require('connect-mongodb-session')(session)
const db = require('./config/db')
const cors = require('cors')
const { cleanUpBin } = require('./utils/cron')

const app = express()
app.use(express.json())
app.use(
    cors({
        origin: "*"
    })
)
const store = new MongoDbSession({
    uri:process.env.MONGODB_URI,
    collection:'sessions'
})

app.use(
    session({
        secret:process.env.SECRET_KEY,
        resave:false,
        saveUninitialized:false,
        store:store
    })
)
app.use('/user',userRoutes)
app.use('/user/blog',blogRoutes)
app.use('/user',followRoutes)
app.listen(process.env.SERVER_PORT,()=>{
    console.log(`Server is runing at port ${process.env.SERVER_PORT}`)
    cleanUpBin()
})