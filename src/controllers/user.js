const { Prisma } = require("@prisma/client")
const prisma = require('../utils/prisma.js')

const createdUser = async (req, res) => {
    const {
        username,
        email,
        password,
        firstName,
        lastName,
        age,
        pictureUrl
    } = req.body

    if (!username || !email || !password || !firstName || !lastName || !age || !pictureUrl) {
        return res.status(400).json({
            error: "Missing fields in request body"
        })
    }
    const createdUser = await prisma.user.create({
        data: {
            username,
            email,
            password,
            profile: {
                create: {
                    firstName,
                    lastName,
                    age,
                    pictureUrl
                },
            },
        }
    })

    res.status(201).json({ user: createdUser })
    console.log("created user")
}

const getUsers = async (req, res) => {
    const users = await prisma.user.findMany()

    res.json({ users })
}

const getUserById = async (req, res) => {
    const id = Number(req.params.id)
    const user = await prisma.user.findUnique({
        where: {
            id: id,
        }
    })
    return res.json({ user })
}

module.exports = { createdUser, getUsers, getUserById }
