const { Prisma } = require("@prisma/client");
const { use } = require("express/lib/router");
const { run } = require("jest");
const prisma = require("../utils/prisma");

const getUsers = async (req, res) => {
  const users = await prisma.users.findMany();

  res.json({ users: users });
};

const getUsersById = async (req, res) => {
  const { id } = req.params;

  const user = await prisma.user.findUnique({
    where: {
      id: Number(id),
    },
  });
  return res.json({ user: user });
};

const createUser = async (req, res) => {
  const { username, email, password, firstName, lastName, age, pictureUrl } =
    req.body;
  if (
    !username ||
    !email ||
    !password ||
    !firstName ||
    !lastName ||
    !age ||
    !pictureUrl
  ) {
    return res.status(400).json({
      error: "Missing fields in request body",
    });
  }
  const userAlreadyExist = await prisma.user.findFirst({
    where: {
      OR: [{ email }, { username }],
    },
  });

  if (userAlreadyExist) {
    return res.status(409).json({
      error: "A user with the provided details already exist",
    });
  }

  const user = await prisma.user.create({
    data: {
      username,
      email,
      password,
      profile: {
        create: {
          firstName,
          lastName,
          age,
          pictureUrl,
        },
      },
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
    },
  });
  res.status(201).json({ user: user });
};

const updateUser = async (req, res) => {
  const { id } = req.params;
  const { username, email, password, firstName, lastName, age, pictureUrl } =
    req.body;

  const findUser = await prisma.user.findUnique({
    where: {
      id: Number(id),
    },
  });
  if (!findUser) {
    return res.status(404).json({
      error: "A user with the provided id does not exist",
    });
  }

  const userAlreadyExist = await prisma.user.findFirst({
    where: {
      OR: [{ email }, { username }],
    },
  });
  if (userAlreadyExist) {
    return res.status(409).json({
      error: "A user with the provided details already exist",
    });
  }

  const user = await prisma.user.update({
    where: { id: Number(id) },
    data: {
      username,
      email,
      password,
      profile: {
        update: {
          firstName,
          lastName,
          age,
          pictureUrl,
        },
      },
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
    },
  });
  res.status(201).json({ user: user });
};

const deleteUser = async (req, res) => {
  const { id } = req.params;

  const findUser = await prisma.user.findUnique({
    where: {
      id: Number(id),
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
      },
  });
  if (!findUser) {
    return res.status(404).json({
      error: "A user with the provided id does not exist",
    });
  }

  const deletePosts = await prisma.post.deleteMany({
    where: { userId: Number(id) },
  })
  const deleteComments = await prisma.comment.deleteMany({
    where: { userId: Number(id) },
  })

  const deleteProfile = await prisma.profile.deleteMany({
    where: { userId: Number(id) },
  })

  const user = await prisma.user.delete({
    where: { id: Number(id) },
  });

  res.status(201).json({ user: findUser });
};

module.exports = { getUsers, getUsersById, createUser, updateUser, deleteUser };
