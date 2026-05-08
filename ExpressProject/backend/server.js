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

// 3. [신규] 점수 전체 초기화 API
app.post('/api/score/reset', (req, res) => {
    fs.writeFile(DATA_FILE, JSON.stringify([], null, 2), (err) => {
        if (err) return res.status(500).send("Reset Error");
        res.status(200).json([]);
    });
});

// 4. 리액트 정적 파일 서빙
const buildPath = path.resolve(__dirname, '..', 'frontend', 'build');
app.use(express.static(buildPath));

// 5. 모든 경로를 index.html로 연결 (404 방지)
app.use((req, res, next) => {
    const indexPath = path.join(buildPath, 'index.html');
    if (fs.existsSync(indexPath)) {
        res.sendFile(indexPath);
    } else {
        next();
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});