const express = require('express')
const router = express()
const { createBlog, myBlog, getHomepageBlogs, deleteBlog, editBlog } = require('../controllers/blogController')
const { isAuth } = require('../middlewares/isAuth')

router.post('/create-blog',isAuth , createBlog)
router.get('/my-blogs/:userId', isAuth, myBlog)
router.delete('/delete-blog/:blogId', isAuth, deleteBlog)
router.put('/edit-blog', isAuth, editBlog)
router.get('/homepageblogs/:userId',isAuth,getHomepageBlogs)

module.exports = router