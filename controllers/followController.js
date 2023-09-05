const Joi = require('joi')
const FollowSchema = require('../models/Follow')
const { verifyUserId } = require('../utils/verifyUserId')
const User = require('../models/User')

const followUser = async (req, res) => {

    const followerUserId = req.params.userId
    const { followingUserId } = req.body

    const isValid = Joi.object({
        followingUserId: Joi.string().required()
    }).validate(req.body)

    if (isValid.error) {
        return res.status(400).send({
            status: 400,
            message: 'Invalid User ID',
            data: isValid.error.details[0].message
        })
    }

    //validate the follower User ID
    try {
        const resVerifyUser = await verifyUserId(followerUserId)

        if (resVerifyUser === 'err') {
            return res.status(400).send({
                status: 400,
                message: 'DB error: Follow User API'
            })
        } else if (resVerifyUser === false) {
            return res.status(400).send({
                status: 400,
                message: 'Follower User ID not found'
            })
        }

    } catch (err) {
        return res.status(400).send({
            status: 400,
            message: 'Unable to find follower user ID'
        })
    }

    //validate the following User ID
    try {
        const resVerifyUser = await verifyUserId(followingUserId)

        if (resVerifyUser === 'err') {
            return res.status(400).send({
                status: 400,
                message: 'DB error: Follow User API'
            })
        } else if (resVerifyUser === false) {
            return res.status(400).send({
                status: 400,
                message: 'Following User ID not found'
            })
        }

    } catch (err) {
        return res.status(400).send({
            status: 400,
            message: 'Unable to find following user ID'
        })
    }


    try {
        //const followingUser = await User.findOne({ _id: followingUserId })
        // console.log(followUser)
        const followDetail = await FollowSchema.findOne({
            followerUserId,
            followingUserId
        })

        if (followDetail) {
            return res.status(400).send({
                status: 400,
                message: 'User already follows.'
            })
        }

        const followObj = new FollowSchema({
            followerUserId: followerUserId,
            //followerName: req.session.user.username,
            followingUserId: followingUserId,
            //followingName: followingUser.username,
        })

        await followObj.save()

        res.status(201).send({
            status: 201,
            message: 'Following Successfully :)'
        })
    } catch (err) {
        res.status(400).send({
            status: 400,
            message: 'DB Error: Follow creation while Following!',
            data:err
        })
    }
}

const followingList = async (req, res) => {
    const userId = req.params.userId
    const page = parseInt(req.query.page) || 1
    const LIMIT = 10

    try {
        const resVerifyUser = await verifyUserId(userId)

        if (resVerifyUser === 'err') {
            return res.status(400).send({
                status: 400,
                message: 'DB Error: Following List Endpoint'
            })
        } else if (resVerifyUser === false) {
            return res.status(400).send({
                status: 400,
                message: 'User ID not found'
            })
        }


    } catch (err) {
        return res.status(400).send({
            status: 400,
            message: 'Unable to find User Id'
        })
    }

    try {
        const followingList = await FollowSchema.find({followerUserId:userId}).sort({crcreationDateAndTime: -1}).skip(page-1).limit(LIMIT)

        let followingUserIdList = []
        
        followingList.forEach((u)=>{followingUserIdList.push(u.followingUserId)})
        //console.log(followingUserIdList)
        const followingUserDetails = await User.find({
            _id: {$in: followingUserIdList}
        })

        let usersData = []

        followingUserDetails.map((user)=>{
            let userData = {
                name:user.name,
                username:user.username,
                email:user.email,
                _id:user._id,
                follow:true
            }

            usersData.push(userData)
        })

        res.status(200).send({
            status:200,
            message:'Fetched all the following list',
            data:usersData
        })
    } catch (err) {
        return res.status(400).send({
            status: 400,
            message: 'Unable to find User Id'
        })
    }
}

const followerList = async (req, res) => {
    const userId = req.params.userId
    const page = parseInt(req.query.page) || 1
    const LIMIT = 10

    try {
        const resVerifyUser = await verifyUserId(userId)

        if (resVerifyUser === 'err') {
            return res.status(400).send({
                status: 400,
                message: 'DB Error: Following List Endpoint'
            })
        } else if (resVerifyUser === false) {
            return res.status(400).send({
                status: 400,
                message: 'User ID not found'
            })
        }


    } catch (err) {
        return res.status(400).send({
            status: 400,
            message: 'Unable to find User Id'
        })
    }

    try {
        const followerList = await FollowSchema.find({followingUserId:userId}).sort({crcreationDateAndTime: -1}).skip(page-1).limit(LIMIT)

        let followerUserIdList = []
        
        followerList.forEach((u)=>{followerUserIdList.push(u.followerUserId)})
        //console.log(followerUserIdList)
        const followerUserDetails = await User.find({
            _id: {$in: followerUserIdList}
        })

        let usersData = []

        followerUserDetails.map((user)=>{
            let userData = {
                name:user.name,
                username:user.username,
                email:user.email,
                _id:user._id
            }

            usersData.push(userData)
        })

        res.status(200).send({
            status:200,
            message:'Fetched all the followers list',
            data:usersData
        })
    } catch (err) {
        return res.status(400).send({
            status: 400,
            message: 'Unable to find User Id'
        })
    }
}

const unfollowUser = async (req, res) => {

    const followerUserId = req.params.userId
    const { followingUserId } = req.body

    const isValid = Joi.object({
        followingUserId: Joi.string().required()
    }).validate(req.body)

    if (isValid.error) {
        return res.status(400).send({
            status: 400,
            message: 'Invalid User ID',
            data: isValid.error.details[0].message
        })
    }

    //validate the follower User ID
    try {
        const resVerifyUser = await verifyUserId(followerUserId)

        if (resVerifyUser === 'err') {
            return res.status(400).send({
                status: 400,
                message: 'DB error: Follow User API'
            })
        } else if (resVerifyUser === false) {
            return res.status(400).send({
                status: 400,
                message: 'Follower User ID not found'
            })
        }

    } catch (err) {
        return res.status(400).send({
            status: 400,
            message: 'Unable to find follower user ID'
        })
    }

    //validate the following User ID
    try {
        const resVerifyUser = await verifyUserId(followingUserId)

        if (resVerifyUser === 'err') {
            return res.status(400).send({
                status: 400,
                message: 'DB error: Follow User API'
            })
        } else if (resVerifyUser === false) {
            return res.status(400).send({
                status: 400,
                message: 'Following User ID not found'
            })
        }

    } catch (err) {
        return res.status(400).send({
            status: 400,
            message: 'Unable to find following user ID'
        })
    }


    try {
        
        await FollowSchema.findOneAndDelete({
            followerUserId,
            followingUserId
        })

        res.status(200).send({
            status: 200,
            message: 'Unfollowed Successfully :)'
        })
    } catch (err) {
        res.status(400).send({
            status: 400,
            message: 'DB Error: Unfollow!',
        })
    }
}

module.exports = { followUser, followingList, followerList, unfollowUser }