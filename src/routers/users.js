const express = require("express");

const { getUsers, getUsersById, createUser, updateUser, deleteUser } = require("../controllers/users");

const router = express.Router();

router.get("/", getUsers);
router.get("/:id", getUsersById);
router.post("/", createUser);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);


module.exports = router;
