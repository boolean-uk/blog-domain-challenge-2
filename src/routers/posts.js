const express = require("express")
const { createPost, getPosts, updatePost, deletePost } = require('../controllers/posts')
const router = express.Router()

router.post('/:userId/posts/', createPost)
router.get('/:userId/posts/', getPosts)
router.put('/:userId/posts/:postId', updatePost)
// router.delete('/:id/posts/:id', deletePost)


module.exports = router