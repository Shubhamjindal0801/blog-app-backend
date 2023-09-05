const User = require('../models/User')
const bcrypt = require('bcrypt')
require('dotenv').config()
const Joi = require('joi')
const SALT_ROUNDS = parseInt(process.env.SALT_ROUNDS)
const { emailCheck } = require('../utils/emailCheck')
const { usernameCheck } = require('../utils/usernameCheck')


const registerUser = async (req, res) => {
    const isValid = Joi.object({
        name: Joi.string().required(),
        username: Joi.string().min(4).max(15).alphanum().required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(6).max(15).required()
    }).validate(req.body)
    if (isValid.err) {
        return res.status(400).send({
            status: 400,
            message: 'Invalid input',
            data: isValid.error
        })
    }
    const isEmailExist = await emailCheck(req.body.email)
    const isUsernameExist = await usernameCheck(req.body.username)
    if (isUsernameExist === 'U') {
        return res.status(400).send({
            status: 400,
            message: 'Username already exist.'
        })
    } else if (isEmailExist === 'E') {
        return res.status(400).send({
            status: 400,
            message: 'Email already exist.'
        })
    }
    const hashPass = await bcrypt.hash(req.body.password, SALT_ROUNDS)
    const userObj = new User({
        name: req.body.name,
        username: req.body.username,
        email: req.body.email,
        password: hashPass,
        passwordShown: req.body.password
    })
    try {
        userObj.save()
        res.status(201).send({
            status: 201,
            message: 'User created succesfully!',
        })
    } catch (err) {
        res.status(400).send({
            status: 400,
            message: "DB Error",
            data: err
        })
    }
}

const loginUser = async (req, res) => {
    const { loginId, password } = req.body
    let userData;
    const isValid = Joi.object({
        loginId: Joi.string().email().required()
    }).validate(loginId)

    try {
        if (isValid.err) {
            userData = await User.findOne({ username: loginId })
        } else {
            userData = await User.findOne({ email: loginId })
        }

        if (!userData) {
            return res.status(400).send({
                status: 401,
                message: 'No user found!'
            })
        }
        req.session.isAuth = true
        req.session.user = {
            name:userData.name,
            username: userData.username,
            email: userData.email,
            userId: userData._id
        }
        const isSamePass = await bcrypt.compare(password, userData.password)
        if (isSamePass) {
            return res.status(200).send({
                status: 200,
                message: `Welcome back ${userData.name}.`,
                data: req.session.user,
            })
        }
        else {
            return res.status(404).send({
                status: 404,
                message: 'Incorrect password. Please try again!',
            })
        }
    }
    catch (err) {
        res.status(400).send({
            status: 400,
            message: "DB Error",
            data: err
        })
    }
}

const logoutUser = async (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(400).send({
                status: 400,
                message: 'Logout unsuccessfull',
                data: err
            })
        }
        return res.status(200).send({
            status: 200,
            message: 'Logged Out successfully',
        })
    })
}

const getAllUsers = async (req,res)=>{
    const userId = req.params.userId
    try{
        const allUsers = await User.find({_id: {$ne :userId}})

        let usersData = []

        allUsers.map((user)=>{
            let userData = {
                name:user.name,
                username:user.username,
                email:user.email,
                _id:user._id
            }

            usersData.push(userData)
        })

        if(allUsers){
            return res.status(200).send({
                status:200,
                message:'All users were find successfuly',
                data:usersData
            })
        }
        res.status(400).send({
            status:400,
            message:'No User were there'
        })
    }catch(err){
        res.status(400).send({
            status:400,
            message:'User detection failed',
            data:err
        })
    }
}

module.exports = { registerUser, loginUser, logoutUser,getAllUsers }