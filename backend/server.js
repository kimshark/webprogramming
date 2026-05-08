const express = require('express');
const fs = require('fs');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000; // 배포 환경의 포트 또는 5000번 사용
const DATA_FILE = path.join(__dirname, 'scores.json');

app.use(cors());
app.use(express.json());

// [중요] 리액트 빌드 파일들이 있는 위치를 지정합니다.
// frontend/build 폴더가 backend와 같은 층에 있다고 가정합니다.
app.use(express.static(path.join(__dirname, '../frontend/build')));

// API: 점수 조회
app.get('/api/score', (req, res) => {
    fs.readFile(DATA_FILE, 'utf8', (err, data) => {
        if (err) return res.json([]);
        res.json(JSON.parse(data || "[]"));
    });
});

// API: 점수 저장
app.post('/api/score', (req, res) => {
    const newScore = req.body;
    fs.readFile(DATA_FILE, 'utf8', (err, data) => {
        const scores = err ? [] : JSON.parse(data || "[]");
        scores.push(newScore);
        fs.writeFile(DATA_FILE, JSON.stringify(scores, null, 2), () => {
            res.send({ status: "success" });
        });
    });
});

// API: 점수 초기화
app.delete('/api/score/all', (req, res) => {
    fs.writeFile(DATA_FILE, JSON.stringify([]), (err) => {
        if (err) return res.status(500).send("실패");
        res.status(200).send("성공");
    });
});

// [중요] 사용자가 어떤 주소로 들어오든 리액트 화면(index.html)을 보여줍니다.
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`배포 서버 실행 중: 포트 ${PORT}`);
});