const User = require('../models/User')

const usernameCheck = async (username) => {
    let userData
    try {
        userData = await User.findOne({ username: username })
    }catch(err){
        res.status(400).send({
            status:400,
            message:'Db Error',
            data:err
        })
    }
    if(userData) return 'U'
    else return true
}


module.exports = {usernameCheck}