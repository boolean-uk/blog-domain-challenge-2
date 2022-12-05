const express = require("express")
const { createComment, updateComment, deleteComment } = require('../controllers/comments')
const router = express.Router()

router.post('/:postId/comments/', createComment)
// router.get('/:userId/posts/', getUserPosts)
router.put('/:postId/comments/:commentId', updateComment)
router.delete('/:postId/comments/:commentId', deleteComment)


module.exports = router