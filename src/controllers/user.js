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
        }, 
        include: {
            profile: true,
        }
    })

    res.status(201).json({ user: createdUser })
    console.log("created user")
}

const updateUser = async (req, res) => {
    const id = Number(req.params.id)
    const user = await prisma.user.update({
        where: {
            id: id,
        },
        data: {
            username: req.body.username,
            email: req.body.email,
            password: req.body.password,
            profile: {
              update: {
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                age: req.body.age,
                pictureUrl: req.body.pictureUrl
              },
            },
          },
        include: {
            profile: true,
        },
    })
    res.status(201).json({ user })
}

const getUsers = async (req, res) => {
    const users = await prisma.user.findMany({
        include: {
            profile: true,
        }}
    )

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

module.exports = { createdUser, getUsers, getUserById, updateUser }
