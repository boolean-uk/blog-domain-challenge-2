const { Prisma } = require("@prisma/client");
const { use } = require("express/lib/router");
const { run } = require("jest");
const { post } = require("../server");
const prisma = require("../utils/prisma");

const getSpecificPosts = async (req, res) => {
  const { id } = req.params;

  const post = await prisma.post.findFirst({
    where: { id: Number(id) },
    select: {
      user: true,
      user: {
        include: {
          profile: true,
        },
      },
      comment: true,
      categories: true,
    },
  });

  if (!post) {
    return res.status(404).json({
      error: "A post with the provided id does not exist",
    });
  }
  res.json({ post: post });
};

const createPosts = async (req, res) => {
  const { id } = req.params;
  const { title, content, imageUrl, publishedAt, categories } = req.body;
 console.log(categories)
  const post = await prisma.post.create({
    data: {
      title,
      content,
      imageUrl,
      createdAt: publishedAt,
      user: {
        connect: {
          id: Number(id),
        },
      },
      categories: {
        create: {
          name : categories[0].name,
        },
      },
    },
    include: {
      categories: true,
      comment: true,
    },
  });
  res.status(201).json({ post: post });
};

const updatePost = async (req, res) => {};

const deletePost = async (req, res) => {};

module.exports = { getSpecificPosts, createPosts, updatePost, deletePost };
