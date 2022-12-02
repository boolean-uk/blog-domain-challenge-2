const prisma = require("../utils/prisma.js");

const { post, user } = require("../utils/prisma.js");

const getPosts = async (req, res) => {
  const orderByObj = {
    latest: "asc",
    oldest: "desc",
  };

  const { page, perPage, order_by } = req.query;
  console.log(order_by);
  console.log(orderByObj[order_by]);
  const posts = await prisma.post.findMany({
    skip: page ? perPage * (page - 1) : undefined,
    take: perPage ? Number(perPage) : undefined,
    orderBy: order_by
      ? { createdAt: orderByObj[order_by] }
      : { createdAt: "asc" },
    include: {
      user: true,
      comments: true,
      categories: true,
    },
  });
  res.status(200).json({ posts });
};

module.exports = {
  getPosts,
};
