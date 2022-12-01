const prisma = require("../utils/prisma.js");

const { MissingFieldsError, CantFindIdError } = require("../utils/errors");
const { post, user } = require("../utils/prisma.js");

const createPost = async (req, res) => {
  console.log(req.body);
  const userId = Number(req.params.userId);
  const { title, content, imageUrl, publishedAt, categories } = req.body;

  if (!title || !content || !imageUrl || !publishedAt || !categories) {
    throw new MissingFieldsError();
  }

  const createdPost = await prisma.post.create({
    data: {
      title,
      content,
      imageUrl,
      publishedAt: new Date(publishedAt),
      categories: {
        create: [...categories],
      },
      user: {
        connect: { id: userId },
      },
    },
    include: {
      user: true,
      comments: true,
      categories: true,
    },
  });

  res.status(201).json({ post: createdPost });
};

const getPosts = async (req, res) => {
  const { page, perPage } = req.query;
  const userId = Number(req.params.userId);
  const posts = await prisma.post.findMany({
    skip: page ? perPage * (page - 1) : undefined,
    take: perPage ? Number(perPage) : undefined,
    where: {
      user: { id: userId },
    },
    include: {
      user: true,
      comments: true,
      categories: true,
    },
  });
  if (!posts.length) {
    throw new CantFindIdError();
  }
  res.status(200).json({ posts });
};

const updatePost = async (req, res) => {
  console.log(req.params);
  const userId = Number(req.params.userId);
  const postId = Number(req.params.postId);
  const { title, content, imageUrl, publishedAt, categories } = req.body;

  console.log(userId, postId);
  console.log(title, content, imageUrl, publishedAt, categories);

  const updatedPost = await prisma.post.update({
    where: { id: postId },
    data: {
      title,
      content,
      imageUrl,
      publishedAt: new Date(publishedAt),
      categories: {
        set: [...categories]
      },
      user: {
        connect: { id: userId },
      },
    },
    include: { user: true, comments: true, categories: true },
  });

  // await prisma.profile.update({
  //   where: { postId: postId },
  //   data: { firstName, lastName, age, pictureUrl },
  // });

  // res.status(201).json({ post: updatedPost });
};

// const deletePost = async (req, res) => {
//   const postId = Number(req.params.id);
//   console.log(postId);

//   const postToDelete = await prisma.post.findUniqueOrThrow({
//     where: { id: postId },
//     include: { profile: true },
//   });
//   console.log(postToDelete.id);

//   await prisma.profile.delete({
//     where: { postId: postId },
//   });

//   await prisma.post.delete({
//     where: { id: postId },
//   });

//   res.status(201).json({ post: postToDelete });
// };

module.exports = {
  createPost,
  getPosts,
  updatePost,
  // deletePost,
};
