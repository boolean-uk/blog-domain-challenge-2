const express = require("express");
require("express-async-errors");
const { Prisma } = require("@prisma/client");

const app = express();

const cors = require("cors");
const morgan = require("morgan");

app.disable("x-powered-by");

// Add middleware
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const userRouter = require("./routers/users");
const postsRouter = require("./routers/posts");
const usersPostsRouter = require("./routers/usersPosts");

app.use("/users", userRouter);
app.use("/posts", postsRouter);
app.use("/users", usersPostsRouter);

app.use((e, req, res, next) => {
  if (e instanceof Prisma.PrismaClientKnownRequestError) {
    if (e.code === "P2002") {
      return res
        .status(409)
        .json({ error: "A user with the provided detail already exists" });
    }
    if (e.code === "P2013") {
      return res.status(400).json({ error: "Missing fields in request body" });
    }
    if (e.code === "P2001") {
      return res.status(404).json({ error: "That resource does not exist" });
    }
    if (e.code === "P2016") {
      return res.status(404).json({ error: "That resource does not exist" });
    }
  }
console.log(e)
  res.status(500).json({ error: "Oooooops" });
});

module.exports = app;
