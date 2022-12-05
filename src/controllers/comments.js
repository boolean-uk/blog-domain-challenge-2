const prisma = require("../utils/prisma.js");

const { MissingFieldsError, CantFindIdError } = require("../utils/errors");
const { post, user } = require("../utils/prisma.js");

const createComment = async (req, res) => {
  const postId = Number(req.params.postId);
  const { userId, content } = req.body;

  if (!userId || !content) {
    throw new MissingFieldsError();
  }

  const createdComment = await prisma.comment.create({
    data: {
      content,
      post: {
        connect: { id: postId },
      },
      user: {
        connect: { id: userId },
      },
    },
  });

  res.status(201).json({ comment: createdComment });
};

const updateComment = async (req, res) => {
  const commentId = Number(req.params.commentId);
  const postId = Number(req.params.postId);
  const { userId, content } = req.body;

  if (!userId || !content) {
    throw new MissingFieldsError();
  }

  const updatedComment = await prisma.comment.update({
    where: { id: commentId },
    data: {
      content,
      user: {
        connect: { id: userId },
      },
      post: {
        connect: { id: postId },
      },
    },
  });

  res.status(201).json({ post: updatedComment });
};

const deleteComment = async (req, res) => {
  const commentId = Number(req.params.commentId);
  const postId = Number(req.params.postId);


  const commentToDelete = await prisma.comment.delete({
    where: { id: commentId },
  });

  res.status(201).json({ post: commentToDelete });

  };

module.exports = {
  createComment,
  updateComment,
  deleteComment
};
