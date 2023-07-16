const express = require("express");
const jwt = require("jsonwebtoken");
const { Users, UserInfos } = require("../models");
const router = express.Router();

// 회원가입 API : POST
router.post("/users", async (req, res) => {
    const { email, password, name, age, gender, profileImage } = req.body;
    const isExistUser = await Users.findOne({ where: { email } });

    // email과 동일한 유저가 실제로 존재하면 error 발생
    if (isExistUser) {
        return res.status(409).json({ message: "이미 존재하는 이메일입니다." });
    }

    // Users 테이블에 사용자를 추가합니다.
    const user = await Users.create({ email, password });

    // UserInfos 테이블에 사용자 정보를 추가합니다.
    // 어떤 사용자의 사용자 정보인지 내용이 필요합니다.
    const userInfo = await UserInfos.create({
        UserId: user.userId, // 생성한 유저의 userId를 바탕으로 사용자 정보를 생성합니다.
        name,
        age,
        gender: gender.toUpperCase(), // 성별을 대문자로 변환합니다.
        profileImage
    });

    return res.status(201).json({ message: "회원가입이 완료되었습니다." });
});


// 로그인 API : POST
router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    const user = await Users.findOne({ where: { email } });

    // 해당하는 사용자가 존재하지 않는 경우
    if (!user) {
        return res.status(401).json({ message: "존재하지 않는 이메일입니다." });
    } else if (user.password !== password) {
        return res.status(401).json({ message: "비밀번호가 일치하지 않습니다." });
    }

    //jwt 생성
    const token = jwt.sign({
        userId: user.userId
    }, "customized_secret_key");
    // 쿠키를 발급
    res.cookie("authorization", `Bearer ${token}`);
    // response 할당
    return res.status(200).json({ message: "로그인 성공" });
});


// 사용자 조회 API : GET
router.get("/users/:userId", async (req, res) => {
    const { userId } = req.params;
  
    const user = await Users.findOne({
      attributes: ["userId", "email", "createdAt", "updatedAt"],
      include: [
        {
          model: UserInfos,  // 1:1 관계를 맺고있는 UserInfos 테이블을 조회합니다.
          attributes: ["name", "age", "gender", "profileImage"],
        }
      ],
      where: { userId }
    });
  
    return res.status(200).json({ data: user });
  });

  
module.exports = router;