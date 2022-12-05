const express = require("express");

const { getUsers, getUsersById, createUser, updateUser, deleteUser, loginUser} = require("../controllers/users");

const router = express.Router();

router.post("/login", loginUser)
router.get("/", getUsers);
router.get("/:id", getUsersById);
router.post("/", createUser);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);


module.exports = router;
