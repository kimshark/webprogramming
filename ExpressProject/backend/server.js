const express = require('express');
const fs = require('fs');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;
const DATA_FILE = path.join(__dirname, 'scores.json');

// 미들웨어 설정
app.use(cors());
app.use(express.json());

// 1. 점수 기록 API (POST)
app.post('/api/score', (req, res) => {
    console.log("데이터 수신:", req.body);
    const newScore = req.body;

    if (!newScore.name || newScore.score === undefined) {
        return res.status(400).json({ message: "데이터 형식이 잘못되었습니다." });
    }

    fs.readFile(DATA_FILE, 'utf8', (err, data) => {
        let scores = [];
        if (!err && data) {
            try {
                scores = JSON.parse(data);
            } catch (e) {
                scores = [];
            }
        }
        
        scores.push(newScore);
        scores.sort((a, b) => b.score - a.score);
        scores = scores.slice(0, 10);

        fs.writeFile(DATA_FILE, JSON.stringify(scores, null, 2), (err) => {
            if (err) return res.status(500).send("저장 실패");
            res.status(200).json(scores);
        });
    });
});

// 2. 점수 가져오기 API (GET)
app.get('/api/score', (req, res) => {
    fs.readFile(DATA_FILE, 'utf8', (err, data) => {
        if (err || !data) return res.json([]);
        res.json(JSON.parse(data));
    });
});

// 3. 리액트 정적 파일 서빙 설정
const buildPath = path.join(__dirname, '../frontend/build');
app.use(express.static(buildPath));

// 4. [중요] 경로 에러 해결을 위한 최종 라우팅
// 'Missing parameter' 에러를 방지하기 위해 정규식 대신 '*' 사용
app.get('*', (req, res) => {
    res.sendFile(path.join(buildPath, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});