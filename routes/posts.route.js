const express = require("express")
const router = express.Router()
const { Posts } = require("../models");
const authMiddleware = require("../middlewares/auth-middleware");

// 게시글 생성 API
// 게시글 생성
router.post("/posts", authMiddleware, async (req, res) => {
    const { userId } = res.locals.user;
    const { title, content } = req.body;

    const post = await Posts.create({
        UserId: userId,
        title,
        content,
    });

    return res.status(201).json({ data: post });
});


// 게시글 목록 조회 API : GET
router.get("/posts", async (req, res) => {
    const posts = await Posts.findAll({
        attributes: ["postId", "title", "createdAt", "updatedAt"],
        order: [['createdAt', 'DESC']],
    });

    return res.status(200).json({ data: posts });
});



// 게시글 상세 조회 : GET
router.get("/posts/:postId", async (req, res) => {
    const { postId } = req.params;
    const post = await Posts.findOne({
        attributes: ["postId", "title", "content", "createdAt", "updatedAt"],
        where: { postId }
    });

    return res.status(200).json({ data: post });
});

module.exports = router;


