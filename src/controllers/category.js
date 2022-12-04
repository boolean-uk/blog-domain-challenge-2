const { Prisma } = require("@prisma/client")
const prisma = require('../utils/prisma.js')

const createCategory = async (req, res) => {
    const { name } = req.body
    if (!name) {
        return res.status(400).json({
            error: "Missing name in request body"
        })
    }
    try {
        const category = await prisma.category.create({
            data: {
                name
            }
        })
        res.status(201).json({ category })
    }
    catch (e) {
        if (e.code === "P2002") {
            return res.status(409).json({ error: "Category already exist" })
        }
        res.status(500).json({ error: e.message })
    }
}

const updateCategory = async (req, res) => {
    const id = Number(req.params.id)
    const { name } = req.body
    if (!name) {
        return res.status(400).json({
            error: "Missing name in request body"
        })
    }
    try {
        const category = await prisma.category.update({
            where: {
                id: id,
            },
            data: { name: req.body.name }
        })
        res.status(201).json({ category })
    }
    catch (e) {
        if (e.code === "P2025") {
            return res.status(404).json({ error: "Could not find category" })
        }
        if (e.code === "P2002") {
            return res.status(409).json({ error: "Category already exist" })
        }
        res.status(500).json({ error: e.message })
    }
}

const deleteCategory = async (req, res) => {
    const id = Number(req.params.id)
    try {
        const deleteCategory = await prisma.category.findUniqueOrThrow({
            where: {id: id},
            include: {profile: true}
          })
          await prisma.category.delete({
            where: {id: id}
          })
        res.status(201).json({ deleteCategory })
    }
    catch (e) {
        if (e.code === "P2025") {
            return res.status(404).json({ error: "Could not find category" })
        }
        res.status(500).json({ error: e.message })
    }
}

const getCategories = async (req, res) => {
    const categories = await prisma.user.findMany()
    res.json({ categories })
}

module.exports = { getCategories, createCategory, updateCategory, deleteCategory }
