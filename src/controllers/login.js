const prisma = require("../utils/prisma.js");
const jwt = require("jsonwebtoken");

const { } = require("../utils/prisma.js");

const login = async (req, res) => {
    const loginData = req.body
    const user = await prisma.user.findUniqueOrThrow({
        where: {userName: loginData.username}
    })
    if (!user) {
        return res.status(400).json({
            error: "Could not find user"
        })
    }
    if (user.password !== loginData.password) {
        throw new WrongPasswordError()
    }
    let token = jwt.sign({id: user.id}, process.env.JWT_SECRET_KEY);
    res.json({token})

};



module.exports = {
    login
};