const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function seed() {
    await createdUser()
    await createProfile()
    await createComment()
    await createPost()
    await createCategory()
    process.exit(0)
}

async function createdUser() {
    const createdUser = await prisma.user.create({
        data: {
            username: 'Alice00',
            email: "Alice00@gmail.com",
            password: "password"
        }
    })
}

async function createProfile() {
    const createProfile = await prisma.profile.create({
        data: {
            firstName: 'Alice',
            lastName: 'Winter',
            age: 30,
            pictureUrl: "https://www.Alice.jpg",
        }
    })
}

async function createComment() {
    const createComment = await prisma.comment.create({
        data: {
            content: '1899 non è così strano'
        }
    })
}

async function createPost() {
    const createPost = await prisma.post.create({
        data: {
            title: 'movies',
            content: 'cosa consigliate?',
            imageUrl: 'https://www.movie.jpg'
        }
    })
}

async function createCategory() {
    const createPost = await prisma.category.create({
        data: {
            name: 'hobby'
        }
    })
}

seed()
    .catch(async e => {
        console.error(e);
        await prisma.$disconnect();
    })
    .finally(() => process.exit(1));