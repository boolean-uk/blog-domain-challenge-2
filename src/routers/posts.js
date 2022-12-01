const express = require("express")
const { createPost, updatePost, deletePost } = require('../controllers/posts')
const router = express.Router()

router.post('/:id/posts/', createPost)
router.put('/:id/posts/:id', updatePost)
router.delete('/:id/posts/:id', deletePost)


module.exports = router