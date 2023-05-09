const express = require("express");
const nodemailer = require("nodemailer");
const app = express();

// bodyParser 미들웨어 추가
app.use(express.json());

app.use((req, res, next) => {
  res.setHeader('Content-Security-Policy', "default-src 'none'; font-src 'self'; img-src 'self'; manifest-src 'self'");
  next();
});

// transporter 객체 생성
let transporter = nodemailer.createTransport({
  host: "smtp.kakao.com",
  port: 465,
  secure: true,
  auth: {
    user: "sujin924@kakao.com", // 발신자 이메일 주소
    pass: "wpqrwqupr14!", // 발신자 이메일 비밀번호
  },
});

// 라우트 설정
app.post("/send-email", (req, res) => {
  const { studentName, parentName, school, grade, studentPhone, parentPhone, message } = req.body;

  const mailOptions = {
    from: "sujin924@kakao.com",
    to: "sujin924@kakao.com",
    subject: "상담문의",
    html: `
      <h3>상담문의</h3>
      <p>학생명: ${studentName}</p>
      <p>학부모명: ${parentName}</p>
      <p>학교: ${school}</p>
      <p>학년: ${grade}</p>
      <p>학생 휴대폰 번호: ${studentPhone}</p>
      <p>학부모 휴대폰 번호: ${parentPhone}</p>
      <p>상담내용: ${message}</p>
    `,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      res.status(500).send("Internal server error");
    } else {
      console.log("Email sent: " + info.response);
      res.status(200).send("Email sent");
    }
  });
});

// 서버 구동
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server is running on port ${port}`));
