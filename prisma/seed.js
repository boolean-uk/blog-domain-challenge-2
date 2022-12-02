const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function seed() {
  await createUser();
  await createProfile();
  await createCategory()
  await createPost();
  await createComment();
}

async function createUser() {
  const user = await prisma.user.createMany({
    data: [{
      username: "Patto",
      email: "vhds@k.com",
      password: "123ABC",
    },
  {
    username: "mccallister",
    email: "home@alone.com",
    password: "123ABC",
  }],
  });
  return user;
}

async function createProfile() {
  const profile = await prisma.profile.create({
    data: {
      firstName: "James",
      lastName: "Gun",
      age: 42,
      pictureUrl: "someURL",
      userId: 1
    },
  });
  return profile;
}

async function createPost() {
  const post = await prisma.post.create({
    data: {
      title: "Guardian Of The Galaxy is the best Marvel movie",
      content: "here's why...",
      imageUrl: "someUrl",
      categories: {
        connect:{id:1}
      },
      userId: 1
    },
  });
  return post;
}

async function createComment() {
  const comment = await prisma.comment.createMany({
    data: [{
      content: "Shut up and make a decent DC movie now!",
      userId: 2,
      postId: 1
    },
    {
      content: 'Amen',
      userId:1,
      postId: 1,
      parentId: 1
    }
  ],
  });
  return comment;
}

async function createCategory() {
  const category = await prisma.category.create({
    data: {
      name: "comedy",
    },
  });
}

seed()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
