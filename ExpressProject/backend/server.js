const express = require('express');
const fs = require('fs');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;
const DATA_FILE = path.join(__dirname, 'scores.json');

app.use(cors());
app.use(express.json());

// 리액트 정적 파일 서빙
app.use(express.static(path.join(__dirname, '../frontend/build')));

// API 라우트들 (중략...)
app.get('/api/score', (req, res) => {
    fs.readFile(DATA_FILE, 'utf8', (err, data) => {
        if (err) return res.json([]);
        res.json(JSON.parse(data || "[]"));
    });
});

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

app.delete('/api/score/all', (req, res) => {
    fs.writeFile(DATA_FILE, JSON.stringify([]), (err) => {
        if (err) return res.status(500).send("실패");
        res.status(200).send("성공");
    });
});

// ⭐ [최종 해결 코드] 따옴표 없는 정규표현식으로 교체 ⭐
// 문자열 '*' 대신 정규표현식 /^(?!\/api).+/ 또는 단순히 /.*/ 를 사용합니다.
app.get(/.*/, (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`배포 서버 실행 중: 포트 ${PORT}`);
});