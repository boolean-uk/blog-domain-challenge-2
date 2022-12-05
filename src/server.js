const express = require("express");
require("express-async-errors");
const app = express();
const { Prisma } = require("@prisma/client");
const { MissingFieldsError, CantFindIdError } = require("../src/utils/errors");

const cors = require("cors");
const morgan = require("morgan");

app.disable("x-powered-by");

// Add middleware
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Tell express to use your routers here

const usersRouter = require("./routers/users");
app.use("/users", usersRouter);
const userPostsRouter = require("./routers/user-posts");
app.use("/users/", userPostsRouter);
const postsRouter = require("./routers/posts");
app.use("/posts", postsRouter);
const commentsRouter = require("./routers/comments");
app.use("/posts/", commentsRouter);
const loginRouter = require("./routers/login");
app.use("/login/", loginRouter);

// Error handling
app.use((e, req, res, next) => {
  console.log(e.code, e.message);
  if (e instanceof Prisma.PrismaClientKnownRequestError) {
    if (e.code === "P2002") {
      return res
        .status(409)
        .json({
          error: "Unique constraint fail. Already exists in the database",
        });
    }
    if (e.code === "P2025") {
      return res.status(404).json({ error: "Could not find record" });
    }
    if (e.code === "P2000") {
      return res.status(409).json({ error: "Value provided was too long" });
    }
  }
  if (e instanceof Prisma.PrismaClientValidationError) {
    return res.status(400).json({ error: "Invalid Data" });
  }
  if (e instanceof MissingFieldsError) {
    return res.status(400).json({ error: e.message });
  }
  if (e instanceof CantFindIdError) {
    return res.status(404).json({ error: e.message });
  }

  res.status(500).json({ error: e.message });
});

module.exports = app;
