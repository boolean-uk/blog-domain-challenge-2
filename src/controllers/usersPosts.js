const { Prisma } = require("@prisma/client");
const { use } = require("express/lib/router");
const { run } = require("jest");
const { post } = require("../server");
const { user } = require("../utils/prisma");
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
          name: categories[0].name,
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

const updatePost = async (req, res) => {
  const { userId, postId } = req.params;
  const { title, content, imageUrl, publishedAt } = req.body;

  const findPost = await prisma.post.findUnique({
    where: {
      id: Number(postId),
    },
    include: {
      categories: true,
    },
  });

  const categoriesToDisconnect = [];
  const categoriesToConnect = [];

  findPost.categories.forEach((category) => {
    req.body.categories.forEach((element) => {
      category.name === element.name
        ? categoriesToDisconnect.push(element)
        : categoriesToConnect.push(element);
    });
  });
  const disconnectCtg = await prisma.post.update({
    where: {
      id: Number(userId),
    },
    data: {
      title,
      content,
      imageUrl,
      createdAt: publishedAt,
      categories: {
        disconnect: categoriesToDisconnect,
      },
    },
    include: {
      categories: true,
    },
  });
 

  req.body.categories.forEach(async (category) => {
    const createCategory = await prisma.category.upsert({
      where: {
        name: category.name,
      },
      update:{
        name: category.name
      },
      create:{
        name: category.name
      }
    });
  });

  const connectCtg = await prisma.post.update({
    where: {
      id: Number(userId),
    },
    data: {
      title,
      content,
      imageUrl,
      createdAt: publishedAt,
      categories: {
        connect:
          findPost.categories.length === 0
            ? req.body.categories
            : categoriesToConnect,
      },
    },
    include: {
      categories: true,
    },
  });

  res.status(201).json({ user: connectCtg });
};

const deletePost = async (req, res) => {
  const { userId, postId } = req.params;

  const findUser = await prisma.user.findUnique({
    where: {
      id: Number(userId),
    },
    include: {
      profile: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          age: true,
          pictureUrl: true,
          createdAt: true,
          updatedAt: true,
        },
      },
      comment: true,
      post: {
        select: {
          categories: true,
        },
      },
    },
  });
  const findPost = await prisma.post.findUnique({
    where: {
      id: Number(postId),
    },
  });
  if (!findUser || !findPost) {
    return res.status(404).json({
      error: "A user/post with the provided id does not exist",
    });
  }
  const deleteComments = await prisma.comment.deleteMany({
    where: { postId: Number(postId) },
  });

  const deletedPost = await prisma.post.delete({
    where: {
      id: Number(postId),
    },
  });

  res.status(201).json({ post: deletedPost });
};

module.exports = { getSpecificPosts, createPosts, updatePost, deletePost };
