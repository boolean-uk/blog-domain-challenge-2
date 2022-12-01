const express = require("express");

const { getSpecificPosts, createPosts, updatePost, deletePost} = require("../controllers/usersPosts");

const router = express.Router();

router.get("/:id/posts", getSpecificPosts);
router.post("/:id/posts", createPosts);
router.put("/:userId/posts/:postId", updatePost);
router.delete("/:userId/posts/:postId", deletePost);



module.exports = router;
