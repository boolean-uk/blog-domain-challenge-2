const { Prisma } = require("@prisma/client");
const { use } = require("express/lib/router");
const { run } = require("jest");
const { comment } = require("../utils/prisma");
const prisma = require("../utils/prisma");

const createComment = async (req, res) => {
  const { id } = req.params;
  const { userId, content } = req.body;

  if (!userId || !content) {
    return res.status(400).json({
      error: "Missing fields in request body",
    });
  }

  const findPost = await prisma.post.findUniqueOrThrow({
    where: {
      id: Number(id),
    },
  });

  const comment = await prisma.comment.create({
    data: {
      postId: Number(id),
      userId,
      content,
    },
  });

  res.status(201).json({ comment: comment });
};

const replyToComment = async (req, res) => {
  const { postId, commentId } = req.params;
  const { userId, content } = req.body;

  if (!userId || !content) {
    return res.status(400).json({
      error: "Missing fields in request body",
    });
  }
  const findPost = await prisma.post.findUniqueOrThrow({
    where: {
      id: Number(postId),
    },
  });
  const findComment = await prisma.comment.findUniqueOrThrow({
    where: {
      id: Number(commentId),
    },
  });

  const comment = await prisma.comment.create({
    data: {
      userId,
      postId: Number(postId),
      content,
      parentId: Number(commentId),
    },
  });

  res.status(201).json({ comment: comment });
};

const updateComment = async (req, res) => {
  const { postId, commentId } = req.params;
  const { userId, content } = req.body;

  if (!userId || !content) {
    return res.status(400).json({
      error: "Missing fields in request body",
    });
  }
  const findPost = await prisma.post.findUniqueOrThrow({
    where: {
      id: Number(postId),
    },
  });
  const findComment = await prisma.comment.findUniqueOrThrow({
    where: {
      id: Number(commentId),
    },
  });
  const comment = await prisma.comment.update({
    where: {
      id: Number(commentId),
    },
    data: {
      userId,
      content,
    },
  });
  res.status(201).json({ comment: comment });
};

const deleteComment = async (req, res) => {
  const { postId, commentId } = req.params;

  const findPost = await prisma.post.findUniqueOrThrow({
    where: {
      id: Number(postId),
    },
  });

  const findComment = await prisma.comment.findUniqueOrThrow({
    where: {
      id: Number(commentId),
    },
  });

  const deleteRelatedComments = await prisma.comment.update({
    where: {
      id: Number(commentId),
    },
    data: {
      child: {
        deleteMany: {},
      },
    },
  });

  const deleteComment = await prisma.comment.delete({
    where: {
      id: Number(commentId),
    },
  });

  res.status(201).json({ comment: findComment });
};

module.exports = {
  createComment,
  replyToComment,
  updateComment,
  deleteComment,
};
