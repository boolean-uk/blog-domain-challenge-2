const express = require("express");

const { createComment, replyToComment, updateComment, deleteComment} = require("../controllers/comments");

const router = express.Router();

router.post("/:id/comments", createComment);
router.post("/:postId/comments/:commentId", replyToComment);
router.put("/:postId/comments/:commentId", updateComment);
router.delete("/:postId/comments/:commentId", deleteComment);



module.exports = router;
