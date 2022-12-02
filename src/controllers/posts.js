const { Prisma } = require("@prisma/client");
const { use } = require("express/lib/router");
const { run } = require("jest");
const prisma = require("../utils/prisma");

const getPosts = async (req, res) => {
  const posts = await prisma.post.findMany({
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

  res.json({ posts: posts });
};

module.exports = { getPosts };
