const prisma = require("../utils/prisma.js");

const { MissingFieldsError } = require("../utils/errors");
const { post, user } = require("../utils/prisma.js");

const createPost = async (req, res) => {
  console.log(req.body);
  const userId = Number(req.params.id);
  const { title, content, imageUrl, publishedAt, categories } = req.body;

  if (
    !title ||
    !content ||
    !imageUrl ||
    !publishedAt ||
    !categories
  ) {
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
        connect: {id: userId}
      }
    },
    include: {
      user: true,
      comments: true,
      categories: true
    },
  });

  res.status(201).json({ post: createdPost });
};

const updatePost = async (req, res) => {
  const { username, email, password, firstName, lastName, age, pictureUrl } =
    req.body;
  const postId = Number(req.params.id);

  const updatedUser = await prisma.post.update({
    where: { id: postId },
    data: { postName: postname, email, password },
    include: { profile: true },
  });

  await prisma.profile.update({
    where: { postId: postId },
    data: { firstName, lastName, age, pictureUrl },
  });

  res.status(201).json({ post: updatedPost });
};

const deletePost = async (req, res) => {
  const postId = Number(req.params.id);
  console.log(postId);

  const postToDelete = await prisma.post.findUniqueOrThrow({
    where: { id: postId },
    include: { profile: true },
  });
  console.log(postToDelete.id);

  await prisma.profile.delete({
    where: { postId: postId },
  });

  await prisma.post.delete({
    where: { id: postId },
  });

  res.status(201).json({ post: postToDelete });
};

module.exports = {
  createPost,
  updatePost,
  deletePost,
};
