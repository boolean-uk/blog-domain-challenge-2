const { Prisma } = require("@prisma/client")
const prisma = require('../utils/prisma.js')

const createPost = async (req, res) => {
    // const {
    //     name,
    //     phone,
    //     email,
    //     fistName,
    //     lastName,
    //     age,
    //     pictureUrl
    // } = req.body

    // if (!name || !phone || !email || !fistName || !lastName || !age || !pictureUrl) {
    //     return res.status(400).json({
    //         error: "Missing fields in request body"
    //     })
    // }
    // const createUser = await prisma.user.create({
    //     data: {
    //         username,
    //         email,
    //         password,
    //         profile: {
    //             create: {
    //                 firstName,
    //                 lastName,
    //                 age,
    //                 pictureUrl,
    //             },
    //         },
    //     },
    //     include: { profile: true }
    // })

    // res.status(201).json({ createUser })
}

module.exports = { createPost }
