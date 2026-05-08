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
      .catch((err) => console.error("점수 로딩 실패:", err));
  };

  useEffect(() => {
    fetchScores();
    const interval = setInterval(fetchScores, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ textAlign: "center", padding: "20px", backgroundColor: "#f0f2f5", minHeight: "100vh" }}>
      <h1>🎮 Project Express Unity</h1>
      <div style={{ display: "flex", justifyContent: "center", gap: "20px", flexWrap: "wrap" }}>
        <div style={{ width: "800px", height: "600px", background: "#000", borderRadius: "10px", overflow: "hidden", boxShadow: "0 4px 15px rgba(0,0,0,0.3)" }}>
          <Unity unityProvider={unityProvider} style={{ width: "100%", height: "100%" }} />
        </div>
        <div style={{ width: "300px", background: "#fff", padding: "20px", borderRadius: "10px", boxShadow: "0 4px 15px rgba(0,0,0,0.1)" }}>
          <h2>🏆 Top 10</h2>
          <ul style={{ listStyle: "none", padding: 0 }}>
            {scores.map((s, i) => (
              <li key={i} style={{ padding: "8px 0", borderBottom: "1px solid #eee" }}>
                {i + 1}위. {s.name} : <strong>{s.score}</strong>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default App;