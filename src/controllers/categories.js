const { Prisma } = require("@prisma/client");
const { use } = require("express/lib/router");
const { run } = require("jest");
const { post } = require("../server");
const { user } = require("../utils/prisma");
const prisma = require("../utils/prisma");

const getCategories = async (req, res) => {
  const categories = await prisma.category.findMany();

  res.json({ category: categories });
};

const createCategory = async (req, res) => {
  if (!req.body.name) {
    return res.status(400).json({
      error: "Missing fields in request body",
    });
  }

  const findCategory = await prisma.category.findUniqueOrThrow({
    where: {
      name: req.body.name,
    },
  });
  const category = await prisma.category.create({
    data: {
      name: req.body.name,
    },
  });

  res.status(201).json({ category: category });
};

const updateCategory = async (req, res) => {
  const { id } = req.params;
  if (!req.body.name) {
    return res.status(400).json({
      error: "Missing fields in request body",
    });
  }

  const findCategoryById = await prisma.category.findUniqueOrThrow({
    where: {
      id: Number(id),
    },
  });
  const findCategoryByName = await prisma.category.findUnique({
    where: {
      name: req.body.name,
    },
  });
  if (findCategoryByName) {
    return res.status(404).json({
      error: "Category with that name already exist",
    });
  }

  const category = await prisma.category.update({
    where: {
      id: Number(id),
    },
    data: {
      name: req.body.name,
    },
  });
  res.status(201).json({ category: category });
};

const deleteCategory = async (req, res) => {
  const { id } = req.params;

  const findCategory = await prisma.category.findUniqueOrThrow({
    where: {
      id: Number(id),
    },
  });

  const category = await prisma.category.delete({
    where: {
      id: Number(id),
    },
  });

  res.status(201).json({category: findCategory})
};

module.exports = {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
};
