const bcrypt = require("bcrypt");
const express = require("express");
const cors = require("cors");
const mysql = require("mysql");
const app = express();
const PORT = 3001;

const db = mysql.createConnection({
    host: "127.0.0.1",
    user: "shop",
    password: "shop",
    database: "shop",
});

db.connect();

db.query('select * from users', (err, rows) => {
    if (err) throw err;
    console.log('DB 연결성공');
  });

app.use(cors({
    origin: "http://localhost:3000",
    credentials: true,
    optionsSuccessStatus: 200
}));

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
    next();
  });

app.use(express.urlencoded({ extended: true}));

app.listen(PORT, ()=> {
    console.log(`${PORT} 포트에서 연결중`)
});

app.get("/api/select", (req,res) => {
    const sqlQuery = "select * from users";
    db.query(sqlQuery, (err, result) => {
        if (err) throw err;
        res.send(result);
    });
});

app.post("/login", (req, res) => { // 데이터 받아서 결과 전송
    const id = req.body.id;
    const pw = req.body.pw;
    const sendData = { isLogin: "" };

    if (id && pw) {             // id와 pw가 입력되었는지 확인
        db.query('SELECT * FROM users WHERE id = ?', [id], function (error, results, fields) {
            if (error) throw error;
            if (results.length > 0) {       // db에서의 반환값이 있다 = 일치하는 아이디가 있다.      

                bcrypt.compare(pw , results[0].userchn, (err, result) => {    
// 입력된 비밀번호가 해시된 저장값과 같은 값인지 비교

                    if (result === true) {                  // 비밀번호가 일치하면
                        req.session.is_logined = true;      // 세션 정보 갱신
                        req.session.nickname = id;
                        req.session.save(function () {
                            sendData.isLogin = "True"
                            res.send(sendData);
                        });
                    }
                    else{                                   // 비밀번호가 다른 경우
                        sendData.isLogin = "로그인 정보가 일치하지 않습니다."
                        res.send(sendData);
                    }
                })                      
            } else {    // db에 해당 아이디가 없는 경우
                sendData.isLogin = "아이디 정보가 일치하지 않습니다."
                res.send(sendData);
            }
        });
    } else {            // 아이디, 비밀번호 중 입력되지 않은 값이 있는 경우
        sendData.isLogin = "아이디와 비밀번호를 입력하세요!"
        res.send(sendData);
    }
});