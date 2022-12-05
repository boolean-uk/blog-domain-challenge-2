const prisma = require("../utils/prisma.js");
const jwt = require("jsonwebtoken");


const { WrongPasswordError, CantFindIdError } = require("../utils/errors");
const { } = require("../utils/prisma.js");

const login = async (req, res) => {
    const loginData = req.body
    const user = await prisma.user.findUniqueOrThrow({
        where: {userName: loginData.username}
    })
    if (!user) {
        throw new CantFindIdError()
    }
    if (user.password !== loginData.password) {
        throw new WrongPasswordError()
    }
    let token = jwt.sign(user.id, process.env.JWT_SECRET_KEY);
    res.json({token})

};



module.exports = {
    login
};
