const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  const alice = await prisma.user.upsert({
    where: { email: "alice@prisma.io" },
    update: {},
    create: {
      email: "alice@prisma.io",
      userName: "AliceX1992",
      password: "Password1234",
      profile: {
        create: {
          firstName: "Alice",
          lastName: "Hanson",
          age: 18,
          pictureUrl: "https://picsum.photos/200",
        },
      },
    },
    include: {
      profile: true,
      posts: true,
      comments: true,
    },
  });



  const bob = await prisma.user.upsert({
    where: { email: "bob@prisma.io" },
    update: {},
    create: {
      email: "bob@prisma.io",
      userName: "BobIsKing",
      password: "eatmyshorts!.1823",
      profile: {
        create: {
          firstName: "Bob",
          lastName: "Ellison",
          age: 22,
          pictureUrl: "https://picsum.photos/200",
        },
      },
      posts: {
        create: {
          title: "Why JavaScript sucks",
          content: "Because I dont understand it...",
          imageUrl: "https://picsum.photos/200",
          publishedAt: new Date(Date.now()),
        },
      },
    },
  });

  const alicePost = await prisma.post.create({
    data: {
      title: "Why Python sucks",
      content: "Because I dont understand it...",
      imageUrl: "https://picsum.photos/200",
      publishedAt: new Date(Date.now()),
      comments: {
        create: {
          content: "Python > JavaScript all day!",
          user: { connect: { id: bob.id } },
        },
      },
      categories: {
        create: [{name: "Python"}, {name: "JavaScript"}, {name: "Coding"}]
      },
      user: { connect: { id: alice.id } },
    },
  });
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
