import React, { useEffect, useState } from "react";
import { Unity, useUnityContext } from "react-unity-webgl";

function App() {
  const [scores, setScores] = useState([]);

  // 1. 유니티 컨텍스트 설정 (대소문자 및 경로 주의)
  const { unityProvider } = useUnityContext({
    loaderUrl: "/UnityGame/Build/GameForder.loader.js",
    dataUrl: "/UnityGame/Build/GameForder.data",
    frameworkUrl: "/UnityGame/Build/GameForder.framework.js",
    codeUrl: "/UnityGame/Build/GameForder.wasm",
  });

  // 2. 서버에서 점수 불러오는 함수
  const fetchScores = () => {
    fetch("/api/score")
      .then((res) => {
        if (!res.ok) throw new Error("네트워크 응답 에러");
        return res.json();
      })
      .then((data) => {
        setScores(data);
      })
      .catch((err) => console.error("점수 로딩 실패:", err));
  };

  // 3. 주기적으로 점수 업데이트 (5초마다)
  useEffect(() => {
    fetchScores();
    const interval = setInterval(fetchScores, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={containerStyle}>
      <header style={headerStyle}>
        <h1>🎮 실시간 게임 랭킹 시스템</h1>
      </header>

      <main style={mainStyle}>
        {/* 왼쪽: 유니티 게임 영역 */}
        <div style={gameWrapperStyle}>
          <Unity unityProvider={unityProvider} style={{ width: "100%", height: "100%" }} />
        </div>

        {/* 오른쪽: 랭킹 보드 영역 */}
        <div style={rankingBoxStyle}>
          <div style={rankingHeaderStyle}>
            <h2>🏆 Top 10 랭킹</h2>
            <button onClick={fetchScores} style={refreshButtonStyle}>🔄 새로고침</button>
          </div>
          
          <div style={listContainerStyle}>
            {scores.length > 0 ? (
              <ul style={listStyle}>
                {scores.map((s, i) => (
                  <li key={i} style={listItemStyle}>
                    <span style={rankStyle}>{i + 1}위</span>
                    {/* 이름이 비어있으면 'Guest'로 표시 */}
                    <span style={nameStyle}>{s.name && s.name.trim() !== "" ? s.name : "Guest"}</span>
                    <span style={scoreStyle}>{s.score.toLocaleString()} PT</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p style={{ textAlign: "center", color: "#888", marginTop: "20px" }}>
                등록된 점수가 없습니다.
              </p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

// --- CSS-in-JS 스타일 정의 ---

const containerStyle = {
  backgroundColor: "#f4f7f9",
  minHeight: "100vh",
  padding: "20px",
  fontFamily: "'Pretendard', sans-serif"
};

const headerStyle = {
  textAlign: "center",
  marginBottom: "30px",
  color: "#333"
};

const mainStyle = {
  display: "flex",
  justifyContent: "center",
  alignItems: "flex-start",
  gap: "30px",
  maxWidth: "1200px",
  margin: "0 auto",
  flexWrap: "wrap"
};

const gameWrapperStyle = {
  width: "800px",
  height: "600px",
  backgroundColor: "#000",
  borderRadius: "15px",
  overflow: "hidden",
  boxShadow: "0 10px 30px rgba(0,0,0,0.2)"
};

const rankingBoxStyle = {
  width: "320px",
  backgroundColor: "#fff",
  borderRadius: "15px",
  padding: "20px",
  boxShadow: "0 4px 20px rgba(0,0,0,0.08)"
};

const rankingHeaderStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  borderBottom: "2px solid #f0f0f0",
  paddingBottom: "10px",
  marginBottom: "15px"
};

const refreshButtonStyle = {
  padding: "6px 12px",
  fontSize: "12px",
  cursor: "pointer",
  backgroundColor: "#1890ff",
  color: "#fff",
  border: "none",
  borderRadius: "5px",
  transition: "0.2s"
};

const listContainerStyle = {
  maxHeight: "500px",
  overflowY: "auto"
};

const listStyle = {
  listStyle: "none",
  padding: 0,
  margin: 0
};

const listItemStyle = {
  display: "flex",
  alignItems: "center",
  padding: "12px 10px",
  borderBottom: "1px solid #f9f9f9",
  fontSize: "16px"
};

const rankStyle = {
  fontWeight: "bold",
  color: "#faad14",
  width: "40px"
};

const nameStyle = {
  flex: 1,
  color: "#555",
  fontWeight: "500"
};

const scoreStyle = {
  fontWeight: "bold",
  color: "#1890ff"
};

export default App;