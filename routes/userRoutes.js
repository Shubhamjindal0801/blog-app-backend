const express = require('express')
const {registerUser,loginUser,logoutUser,getAllUsers} = require('../controllers/userController')
const {isAuth} = require('../middlewares/isAuth')
const router = express()

router.post('/signup',registerUser)
router.post('/login',loginUser)
router.post('/logout',isAuth,logoutUser)
router.get('/allusers/:userId',isAuth,getAllUsers)

module.exports = router