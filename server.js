const bcrypt = require("bcrypt");
const express = require("express");
const session = require('express-session');
const cors = require("cors");
const mysql = require("mysql");
const app = express();
const PORT = 3001;

app.use(session({
    secret: 'temporary-secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 60 * 60 * 1000,
    },
  }));

const db = mysql.createConnection({
    host: "127.0.0.1",
    user: "shop",
    password: "shop",
    database: "shop",
    port:3307 //DB포트만 바꿔서 테스트
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

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
    next();
  });

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

app.post("/api/session", (req, res) => {
    if (req.session.is_logined) {
        res.send({ 
            session: {
                is_logined: req.session.is_logined,
                nickname: req.session.nickname 
            }
        });
    } else {
        res.send({ 
            session: {
                is_logined: req.session.is_logined,
            }
        });
    }
});


app.post("/login", (req, res) => { 
    const id = req.body.id;
    const pw = req.body.pw;
    const sendData = { isLogin: "" };

    if (id && pw) { 
        db.query('SELECT * FROM users WHERE uId = ?', [id], function (error, results, fields) {
            if (error) throw error;
            if (results.length > 0) {
                bcrypt.compare(pw , results[0].uPw, (err, result) => { 
                    if (result === true) { 
                        req.session.is_logined = true; 
                        req.session.nickname = results[0].uNick; // 데이터베이스의 uNick 컬럼 값으로 변경
                        req.session.save(function () {
                            sendData.isLogin = "True"
                            sendData.session = req.session;
                            res.send(sendData);
                        });
                    }
                    else{ 
                        sendData.isLogin = "로그인 정보가 일치하지 않습니다."
                        res.send(sendData);
                    }
                })                      
            } else {  
                sendData.isLogin = "아이디 정보가 일치하지 않습니다."
                res.send(sendData);
            }
        });
    } else { 
        sendData.isLogin = "아이디와 비밀번호를 입력하세요!"
        res.send(sendData);
    }    
});

app.post("/logout", (req, res) => {
    if (req.session) {
        // 세션 삭제
        req.session.destroy(function(err) {
            if (err) {
                // 에러 처리
                console.log(err);
            } else {
                // 세션 삭제 후 응답을 보냅니다.
                res.send({ status: "Logged out" });
            }
        });
    } else {
        // 세션이 존재하지 않는 경우
        res.send({ status: "No active session" });
    }
});