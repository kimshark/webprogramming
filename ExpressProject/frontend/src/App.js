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

  // 점수 목록 불러오기
  const fetchScores = () => {
    fetch("/api/score")
      .then((res) => res.json())
      .then((data) => setScores(data))
      .catch((err) => console.error("점수 로딩 실패:", err));
  };

  useEffect(() => {
    fetchScores();
    const interval = setInterval(fetchScores, 5000); // 5초마다 갱신
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ textAlign: "center", padding: "20px", backgroundColor: "#f0f2f5", minHeight: "100vh" }}>
      <h1>🎮 Unity Express</h1>
      
      <div style={{ display: "flex", justifyContent: "center", gap: "20px", flexWrap: "wrap" }}>
        {/* 유니티 게임 화면 */}
        <div style={{ width: "800px", height: "600px", background: "#000", borderRadius: "10px", overflow: "hidden", boxShadow: "0 4px 15px rgba(0,0,0,0.3)" }}>
          <Unity unityProvider={unityProvider} style={{ width: "100%", height: "100%" }} />
        </div>

        {/* 실시간 랭킹 보드 */}
        <div style={{ width: "300px", background: "#fff", padding: "20px", borderRadius: "10px", boxShadow: "0 4px 15px rgba(0,0,0,0.1)" }}>
          <h2 style={{ borderBottom: "2px solid #333", paddingBottom: "10px" }}>🏆 실시간 랭킹</h2>
          <ul style={{ listStyle: "none", padding: 0 }}>
            {scores.length > 0 ? (
              scores.map((s, index) => (
                <li key={index} style={{ padding: "10px 0", borderBottom: "1px solid #eee", fontSize: "18px" }}>
                  <strong>{index + 1}위.</strong> {s.name} : <span style={{ color: "#e74c3c", fontWeight: "bold" }}>{s.score}점</span>
                </li>
              ))
            ) : (
              <p>아직 기록이 없습니다.</p>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default App;