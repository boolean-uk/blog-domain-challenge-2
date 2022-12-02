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
    try {
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
    catch (e) {
        if (e.code === "P2002") {
            return res.status(409).json({ error: "User already exist" })
        }
        res.status(500).json({ error: e.message })
    }
}

const updateUser = async (req, res) => {
    const id = Number(req.params.id)
    try {
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
    catch (e) {
        if (e.code === "P2025") {
            return res.status(404).json({ error: "Could not find user" })
        }
        if (e.code === "P2002") {
            return res.status(409).json({ error: "User already exist" })
        }
        res.status(500).json({ error: e.message })
    }
}

const deleteUser = async (req, res) => {
    const id = Number(req.params.id)
    try {
        const deleteUser = await prisma.user.findUniqueOrThrow({
            where: {id: id},
            include: {profile: true}
          })

          await prisma.profile.delete({
            where: {userId: id}
          })
          await prisma.user.delete({
            where: {id: id}
          })
        res.status(201).json({ deleteUser })
    }
    catch (e) {
        if (e.code === "P2025") {
            return res.status(404).json({ error: "Could not find user" })
        }
        res.status(500).json({ error: e.message })
    }
}

const getUsers = async (req, res) => {
    const users = await prisma.user.findMany({
        include: {
            profile: true,
        }
    }
    )

    res.json({ users })
}

const getUserById = async (req, res) => {
    const id = Number(req.params.id)
    // findUniqueOrThrow get the same error if user doesn't exist
    try {
        const user = await prisma.user.findUnique({
            where: {
                id: id,
            },
            include: { profile: true }
        })
        return res.json({ user })
    }
    catch (e) {
        if (e.code === "P2025") {
            return res.status(404).json({ error: "Could not find user" })
        }
        res.status(500).json({ error: e.message })
    }
}

module.exports = { createdUser, getUsers, getUserById, updateUser, deleteUser }
