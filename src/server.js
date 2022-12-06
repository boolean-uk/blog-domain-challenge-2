const express = require('express');
const app = express();
const { Prisma } = require('@prisma/client');


const cors = require('cors');
const morgan = require('morgan');

app.disable('x-powered-by');

// Add middleware
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Tell express to use your routers here
const userRouter = require("./routers/user");
// const postsRouter = require("./routers/posts");
// const usersPostsRouter = require("./routers/usersPosts");

app.use("/user", userRouter);
// app.use("/posts", postsRouter);
// app.use("/users", usersPostsRouter);




app.get('/', (req, res) => {
    res.send('Hello World!')
  })


module.exports = app