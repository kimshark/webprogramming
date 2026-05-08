
const express = require('express');
const fs = require('fs');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 10000; // Render 포트 대응
const DATA_FILE = path.join(__dirname, 'scores.json');

app.use(cors());
app.use(express.json());

// 1. 점수 기록 API
app.post('/api/score', (req, res) => {
    const newScore = req.body;
    if (!newScore.name || newScore.score === undefined) {
        return res.status(400).json({ message: "Invalid data" });
    }

    fs.readFile(DATA_FILE, 'utf8', (err, data) => {
        let scores = [];
        if (!err && data) {
            try { scores = JSON.parse(data); } catch (e) { scores = []; }
        }
        scores.push(newScore);
        scores.sort((a, b) => b.score - a.score);
        scores = scores.slice(0, 10);

        fs.writeFile(DATA_FILE, JSON.stringify(scores, null, 2), (err) => {
            if (err) return res.status(500).send("Save Error");
            res.status(200).json(scores);
        });
    });
});

// 2. 점수 가져오기 API
app.get('/api/score', (req, res) => {
    fs.readFile(DATA_FILE, 'utf8', (err, data) => {
        if (err || !data) return res.json([]);
        res.json(JSON.parse(data));
    });
});

// 3. 리액트 정적 파일 서빙 (경로를 절대경로로 확실히 잡음)
// ExpressProject/frontend/build 위치를 정확히 가리켜야 합니다.
const buildPath = path.join(__dirname, '../../frontend/build');
app.use(express.static(buildPath));

// 4. [핵심] 모든 경로를 index.html로 연결 (에러 유발 구문 삭제됨)
app.get('*', (req, res) => {
    res.sendFile(path.join(buildPath, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});