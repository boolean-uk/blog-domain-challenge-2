const { Prisma } = require("@prisma/client");
const { use } = require("express/lib/router");
const { run } = require("jest");
const { comment } = require("../utils/prisma");
const prisma = require("../utils/prisma");
const jwt = require("jsonwebtoken");

const secret = process.env.JWT_SECRET;

const createComment = async (req, res) => {
  const { id } = req.params;
  const { userId, content } = req.body;
  try {
    const auth = req.get("Authorization");
    jwt.verify(auth, secret);
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
  } catch (e) {
    res.status(401).json({ message: "Invalid token" });
  }
};

const replyToComment = async (req, res) => {
  const { postId, commentId } = req.params;
  const { userId, content } = req.body;

  try {
    const auth = req.get("Authorization");
    jwt.verify(auth, secret);
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
  } catch (e) {
    res.status(401).json({ message: "Invalid token" });
  }
};

const updateComment = async (req, res) => {
  const { postId, commentId } = req.params;
  const { userId, content } = req.body;

  try {
    const auth = req.get("Authorization");
    jwt.verify(auth, secret);
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
  } catch (e) {
    res.status(401).json({ message: "Invalid token" });
  }
};

const deleteComment = async (req, res) => {
  const { postId, commentId } = req.params;

  try {
    const auth = req.get("Authorization");
    jwt.verify(auth, secret);
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
  } catch (e) {
    res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = {
  createComment,
  replyToComment,
  updateComment,
  deleteComment,
};
