const prisma = require("../utils/prisma.js");
const jwt = require('jsonwebtoken');


const { MissingFieldsError, CantFindIdError, InvalidTokenError, UnauthorizedError } = require("../utils/errors");
const { post, user } = require("../utils/prisma.js");

const createPost = async (req, res) => {
  const token = req.get('authorization');
  const userId = Number(req.params.userId);
  let payload = ''
  console.log('token: ',token)

  try {
    payload = Number(jwt.verify(token, process.env.JWT_SECRET_KEY))
  } catch (error) {
    throw new InvalidTokenError()
  }

  if (payload !== userId) {
    console.log(payload, userId)
    throw new UnauthorizedError()
  }
  
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

const getUserPosts = async (req, res) => {
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

// const updatePosts = async (req, res) => {
//   const postId = Number(req.params.postId);
//   const { title, }

// }

const updatePost = async (req, res) => {
  const userId = Number(req.params.userId);
  const postId = Number(req.params.postId);
  const { title, content, imageUrl, publishedAt, categories } = req.body;

  const postToUpdate = await prisma.post.findFirstOrThrow({
    where: { id: { equals: postId }, userId: { equals: userId } },
    include: { categories: true },
  });

  const categoriesQuery = {
    disconnect: [],
    connect: [],
    create: [],
  };

  for (const category of categories) {
    const alreadyExistOnPost = postToUpdate.categories.find(
      (c) => c.name === category.name
    );
    if (alreadyExistOnPost) {
      categoriesQuery.disconnect.push({ name: category.name });
      continue;
    }
    const categoryAlreadyExistsButNotConnected =
      await prisma.category.findUnique({
        where: { name: category.name },
      });
    if (categoryAlreadyExistsButNotConnected) {
      categoriesQuery.connect.push({ name: category.name });
      continue;
    }
    categoriesQuery.create.push({ name: category.name });
  }

  const updatedPost = await prisma.post.update({
    where: { id: postId },
    data: {
      title,
      content,
      imageUrl,
      publishedAt: new Date(publishedAt),
      categories: categoriesQuery,
    },
    include: { user: true, comments: true, categories: true },
  });

  res.status(201).json({ post: updatedPost });
};

const deletePost = async (req, res) => {
  const userId = Number(req.params.userId);
  const postId = Number(req.params.postId);

  console.log(postId, userId);

  const postToDelete = await prisma.post.findUniqueOrThrow({
    where: { id: postId },
    include: {comments: true, categories: true, user: true }
  });

  console.log(postToDelete)

  await prisma.comment.deleteMany({
    where: {postId: postId},
  })
  
  await prisma.post.delete({
    where: { id: postId },
  });

  res.status(201).json({ post: postToDelete });

  };

  const getPosts = async (req, res) => {
    const { page, perPage, orderBy } = req.query;
    const posts = await prisma.post.findMany({
      skip: page ? perPage * (page - 1) : undefined,
      take: perPage ? Number(perPage) : undefined,
      orderBy: orderBy ? {createdAt: orderBy} : {createdAt: 'desc'},
      include: {
        user: true,
        comments: true,
        categories: true,
      },
    });
    res.status(200).json({ posts });
  };



module.exports = {
  createPost,
  getUserPosts,
  updatePost,
  deletePost,
  getPosts
};
