const express = require('express');
const fs = require('fs');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 10000;
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

// --- 수정된 핵심 구간 ---

// 3. 리액트 정적 파일 서빙
// path.join 대신 path.resolve를 사용하여 경로를 더 확실하게 잡습니다.
const buildPath = path.resolve(__dirname, '..', 'frontend', 'build');
app.use(express.static(buildPath));
console.log("실제 탐색 경로:", buildPath); // 로그로 경로를 확인해 보세요!

app.use((req, res) => {
    const indexPath = path.join(buildPath, 'index.html');
    if (fs.existsSync(indexPath)) {
        res.sendFile(indexPath);
    } else {
        res.status(404).send("Build file not found");
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});