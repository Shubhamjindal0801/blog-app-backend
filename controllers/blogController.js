const Joi = require('joi')
const Blog = require('../models/Blog')
const User = require('../models/User')
const FollowSchema = require('../models/Follow')

const createBlog = async (req, res) => {

    const isValid = Joi.object({
        title: Joi.string().required(),
        textBody: Joi.string().max(1000).required(),
        userId: Joi.string().required()
    }).validate(req.body)

    if (isValid.error) {
        return res.status(400).send({
            status: 400,
            message: 'Invalid Data Format',
            data: isValid.error
        })
    }
    //console.log(req.seesion.user.userId)
    //alert(session.user.userId)
    let userData;
    try{
        userData = await User.findById(req.body.userId)
    }catch(err){
        return res.status(400).send({
            status: 400,
            message: 'Unable to fetch User',
            data: err
        })
    }


    const blogObj = new Blog({
        title: req.body.title,
        textBody: req.body.textBody,
        userId: req.body.userId,
        username:userData.username
    })

    try {
        await blogObj.save()
        return res.status(201).send({
            status: 201,
            message: 'Blog Created Successfully',
            data: blogObj
        })
    } catch (err) {
        res.status(400).send({
            status: 400,
            message: 'Blog creation failed',
            data: err
        })
    }
}

const myBlog = async (req, res) => {
    const userId = req.params.userId
    const page = parseInt(req.query.page) || 1
    const LIMIT = 10

    try {
        // const myBlogData = await Blog.aggregate([
        //     {$match: {userId: userId}},
        //     {$sort: {creationDateAndTime: -1}},
        //     {
        //         $facet: {
        //             data: [{$skip: (page-1)*LIMIT},{$limit: LIMIT}]
        //         }
        //     }
        // ])

        const myBlogData = await Blog.find({ userId: userId, isDeleted: false })
            .sort({ creationDateAndTime: -1 })
            .skip(page - 1)
            .limit(LIMIT)

        if (myBlogData) {
            res.status(200).send({
                status: 200,
                message: 'Requested Blogs',
                data: myBlogData
            })
        } else {
            res.status(400).send({
                status: 400,
                message: `No blogs found with this user id: ${userId} `
            })
        }
    } catch (err) {
        res.status(400).send({
            status: 400,
            message: 'Failed to get blogs',
            data: err
        })
    }
}

const deleteBlog = async (req, res) => {
    const blogId = req.params.blogId

    try {
        await Blog.findByIdAndUpdate(
            {
                _id: blogId,
            },
            {
                isDeleted: true, deletionDateTime: Date.now()
            }
        )

        res.status(200).send({
            status: 200,
            message: 'Blog deleted succesfully'
        })
    } catch (err) {
        res.status(400).send({
            status: 400,
            message: 'Unable to delete the blog!',
            data: err.message
        })
    }
}

const editBlog = async (req, res) => {
    const { blogId, title, textBody, userId } = req.body

    try {
        const blogData = await Blog.findById(blogId)

        if (!(blogData.userId).toString() === (userId).toString()) {
            return res.status(401).send({
                status: 401,
                message: 'Not allowed to edit, Authorization failed!'
            })
        }
        if (title.trim().length == 0 || textBody.trim().lenth == 0) {
            return res.status(401).send({
                status: 401,
                message: 'Please fill all the fields first!'
            })
        }


        // const creationDateAndTime = blogData.creationDateAndTime.getTime()
        // const currentDateAndTime = Date.now()
        // const diff = (currentDateAndTime - creationDateAndTime) / (1000 * 60)

        // if (diff > 300) {
        //     return res.status(400).send({
        //         status: 400,
        //         message: 'Not allowed to edit after 30 minutes of creation!'
        //     })
        // }

    } catch (err) {
        res.status(400).send({
            status: 400,
            message: 'Unable to edit the blog',
            data: err.message
        })
    }

    try {
        const newBlogData = {
            title,
            textBody
        }

        await Blog.findByIdAndUpdate({ _id: blogId }, newBlogData)
        res.status(200).send({
            status: 200,
            message: 'Blog edited successfully'
        })

    } catch (err) {
        res.status(400).send({
            status: 400,
            message: 'Unable to edit the blog',
            data: err.message
        })
    }
}

const getHomepageBlogs = async (req, res) => {
    const userId = req.params.userId
    const page = req.params.page || 1
    const LIMIT = 10
    try {
        const followingList = await FollowSchema.find({ followerUserId: userId })

        let followingUserIdList = []

        followingList.forEach((u) => {
            followingUserIdList.push(u.followingUserId)
        })

        const followingUserDetails = await Blog.find({
            userId: { $in: followingUserIdList },
            isDeleted : false
        })
        res.status(200).send({
            status: 200,
            message: 'Successfully get the information',
            data: followingUserDetails
        })
    } catch (err) {
        return res.statu(400).send({
            status: 400,
            message: 'Error While loading homepage',
            data: err
        })
    }
}

module.exports = { createBlog, myBlog, deleteBlog, editBlog, getHomepageBlogs }