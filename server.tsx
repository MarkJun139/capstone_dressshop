import bcrypt from "bcrypt";
import express, { Request, Response } from "express";
import cors from "cors";
import mysql, { Connection, FieldPacket, QueryError } from "mysql2";
import session, { Session, SessionData } from "express-session";

declare module 'express-session' {
  interface SessionData {
    is_logined?: boolean;
    nickname?: string;
  }
}

const app = express();
const PORT = 3001;

const db: Connection = mysql.createConnection({
  host: "127.0.0.1",
  user: "shop",
  password: "shop",
  database: "shop",
});

db.connect((err: QueryError | null) => {
  if (err) throw err;
  console.log('DB 연결 성공');
});

app.use(cors({
  origin: "*",
  credentials: true,
  optionsSuccessStatus: 200,
}));

app.use(express.urlencoded({ extended: true }));

app.use(session({
  secret: "your-secret-key",
  resave: false,
  saveUninitialized: true,
}));

app.listen(PORT, () => {
  console.log(`${PORT} 포트에서 연결중`);
});

app.get("/api/select", (req: Request, res: Response) => {
  const sqlQuery = "SELECT * FROM users";
  db.query(sqlQuery, (err: QueryError | null, result: any[], fields?: FieldPacket[]) => {
    if (err) throw err;
    res.send(result);
  });
});

app.post("/login", (req: Request, res: Response) => {
  const id: string = req.body.id;
  const pw: string = req.body.pw;
  const sendData = { isLogin: "" };

  if (id && pw) {
    db.query('SELECT * FROM users WHERE id = ?', [id], (error: QueryError | null, results: any[], fields?: FieldPacket[]) => {
      if (error) throw error;
      if (results.length > 0) {
        bcrypt.compare(pw, results[0].password, (err: Error | undefined, result: boolean) => {
          if (result === true) {
            req.session.is_logined = true;
            req.session.nickname = id;
            req.session.save((saveErr: Error | null) => {
              if (saveErr) throw saveErr;
              sendData.isLogin = "True";
              res.send(sendData);
            });
          } else {
            sendData.isLogin = "로그인 정보가 일치하지 않습니다.";
            res.send(sendData);
          }
        });
      } else {
        sendData.isLogin = "아이디 정보가 일치하지 않습니다.";
        res.send(sendData);
      }
    });
  } else {
    sendData.isLogin = "아이디와 비밀번호를 입력하세요!";
    res.send(sendData);
  }
});