import React, { useEffect, useState } from "react";
import { Unity, useUnityContext } from "react-unity-webgl";

function App() {
  const [scores, setScores] = useState([]);

  const { unityProvider } = useUnityContext({
    loaderUrl: "/UnityGame/Build/GameForder.loader.js",
    dataUrl: "/UnityGame/Build/GameForder.data",
    frameworkUrl: "/UnityGame/Build/GameForder.framework.js",
    codeUrl: "/UnityGame/Build/GameForder.wasm",
  });

  const fetchScores = () => {
    fetch("/api/score")
      .then((res) => res.json())
      .then((data) => setScores(data))
      .catch((err) => console.error("로딩 실패:", err));
  };

  const resetScores = () => {
    if (window.confirm("정말로 모든 점수 데이터를 초기화하시겠습니까?")) {
      fetch("/api/score/reset", { method: "POST" })
        .then((res) => {
          if (res.ok) {
            setScores([]);
            alert("초기화되었습니다.");
          }
        });
    }
  };

  useEffect(() => {
    fetchScores();
    const interval = setInterval(fetchScores, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={containerStyle}>
      <h1 style={{ textAlign: "center", marginBottom: "20px" }}>🎮 Unity Web Project</h1>
      <div style={contentStyle}>
        <div style={gameStyle}>
          <Unity unityProvider={unityProvider} style={{ width: "100%", height: "100%" }} />
        </div>
        <div style={rankingBoxStyle}>
          <div style={headerStyle}>
            <h2>🏆 Top 10</h2>
            <div style={{ display: 'flex', gap: '5px' }}>
              <button onClick={fetchScores} style={btnStyle("#1890ff")}>🔄</button>
              <button onClick={resetScores} style={btnStyle("#ff4d4f")}>🗑️</button>
            </div>
          </div>
          <ul style={{ listStyle: "none", padding: 0 }}>
            {scores.map((s, i) => (
              <li key={i} style={listItemStyle}>
                <span>{i + 1}위. {s.name || "Guest"}</span>
                <strong>{s.score} PT</strong>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

// --- Styles ---
const containerStyle = { padding: "40px", backgroundColor: "#f0f2f5", minHeight: "100vh" };
const contentStyle = { display: "flex", justifyContent: "center", gap: "20px", flexWrap: "wrap" };
const gameStyle = { width: "800px", height: "600px", background: "#000", borderRadius: "10px", overflow: "hidden" };
const rankingBoxStyle = { width: "300px", background: "#fff", padding: "20px", borderRadius: "10px", boxShadow: "0 4px 10px rgba(0,0,0,0.1)" };
const headerStyle = { display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #eee", marginBottom: "10px" };
const btnStyle = (color) => ({ padding: "5px 10px", cursor: "pointer", border: "none", borderRadius: "4px", backgroundColor: color, color: "#fff" });
const listItemStyle = { display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid #f5f5f5" };

export default App;