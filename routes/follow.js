const express = require('express')
const { followUser, followingList, followerList, unfollowUser } = require('../controllers/followController')
const { isAuth } = require('../middlewares/isAuth')
const router = express()

router.post('/follow-user/:userId',isAuth,followUser)
router.get('/following-list/:userId',isAuth,followingList)
router.get('/follower-list/:userId',isAuth,followerList)
router.post('/unfollow-user/:userId',isAuth,unfollowUser)


module.exports = router