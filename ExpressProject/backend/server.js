const express = require('express');
const fs = require('fs');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;
const DATA_FILE = path.join(__dirname, 'scores.json');

app.use(cors());
app.use(express.json());

// 리액트 빌드 파일 정적 서빙 (경로를 절대 경로로 더 확실히 잡음)
const buildPath = path.resolve(__dirname, '../frontend/build');
app.use(express.static(buildPath));

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

// [핵심] 리액트 라우팅 처리 - 정규표현식으로 모든 경로 대응
app.get(/.*/, (req, res) => {
    res.sendFile(path.join(buildPath, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`서버 실행 중: 포트 ${PORT}`);
});