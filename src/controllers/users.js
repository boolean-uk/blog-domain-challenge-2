const prisma = require("../utils/prisma.js");

const { MissingFieldsError } = require("../utils/errors");
const { user } = require("../utils/prisma.js");

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
    throw new MissingFieldsError();
  }

  const createdUser = await prisma.user.create({
    data: {
      userName: username,
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
      profile: true,
    },
  });

  res.status(201).json({ user: createdUser });
};

const updateUser = async (req, res) => {
  const { username, email, password, firstName, lastName, age, pictureUrl } =
    req.body;
  const userId = Number(req.params.id);

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: { userName: username, email, password },
    include: { profile: true },
  });

  await prisma.profile.update({
    where: { userId: userId },
    data: { firstName, lastName, age, pictureUrl },
  });

  res.status(201).json({ user: updatedUser });
};

const deleteUser = async (req, res) => {
  const userId = Number(req.params.id);

  const userToDelete = await prisma.user.findUniqueOrThrow({
    where: {id: userId},
    include: {profile: true}
  })

  await prisma.profile.delete({
    where: {userId: userId}
  })

  await prisma.user.delete({
    where: {id: userId}
  })

  res.status(201).json({ user: userToDelete });

}

module.exports = {
  createUser,
  updateUser,
  deleteUser
};
