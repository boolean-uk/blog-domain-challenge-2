const express = require("express")
const { createPost, getUserPosts, updatePost, deletePost } = require('../controllers/user-posts')
const router = express.Router()

router.post('/:userId/posts/', createPost)
router.get('/:userId/posts/', getUserPosts)
router.put('/:userId/posts/:postId', updatePost)
router.delete('/:userId/posts/:postId', deletePost)


module.exports = router