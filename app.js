const express = require("express");
const cookieParser = require("cookie-parser");
const usersRouter = require("./routes/users.route");
const postsRouter = require("./routes/posts.route");
const app = express();
// const PORT = 3018;

require('dotenv').config();

app.use(express.json());
app.use(cookieParser());
app.use('/api', [usersRouter, postsRouter]);

app.listen(process.env.port, () => {
    console.log(process.env.port, ` 포트 번호로 서버가 실행되었습니다.`);
})

