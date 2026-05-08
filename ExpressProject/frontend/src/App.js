import React, { useEffect, useState } from 'react';
import { Unity, useUnityContext } from "react-unity-webgl";

function App() {
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);

  // 유니티 경로 설정 - 앞에 /를 붙여서 절대 경로로 인식하게 함
  const { unityProvider } = useUnityContext({
    loaderUrl: "/UnityGame/Build/GameForder.loader.js",
    dataUrl: "/UnityGame/Build/GameForder.data",
    frameworkUrl: "/UnityGame/Build/GameForder.framework.js",
    codeUrl: "/UnityGame/Build/GameForder.wasm",
  });

  useEffect(() => {
    let isMounted = true;
    const fetchData = () => {
      fetch('/api/score') // 배포용 상대 경로
        .then(res => res.json())
        .then(data => {
          if (isMounted) {
            setScores(data);
            setLoading(false);
          }
        })
        .catch(() => { if (isMounted) setLoading(false); });
    };
    fetchData(); 
    const interval = setInterval(fetchData, 3000); 
    return () => { isMounted = false; clearInterval(interval); };
  }, []);

  const resetScores = async () => {
    if (window.confirm("정말로 모든 기록을 삭제하시겠습니까?")) {
      try {
        const response = await fetch('/api/score/all', { method: 'DELETE' });
        if (response.ok) {
          setScores([]);
          alert("초기화 완료!");
        }
      } catch (e) {
        alert("서버 연결 실패!");
      }
    }
  };

  return (
    <div style={{ padding: 24, display: 'flex', flexDirection: 'column', alignItems: 'center', backgroundColor: '#f0f2f5', minHeight: '100vh' }}>
      <h1>🎮 부산 프로젝트 통합 관리 (배포 버전)</h1>
      <div style={{ width: '800px', height: '600px', border: '8px solid #34495e', borderRadius: '15px', overflow: 'hidden', backgroundColor: '#000', marginBottom: '40px' }}>
        <Unity unityProvider={unityProvider} style={{ width: '100%', height: '100%' }} />
      </div>
      <div style={{ width: '100%', maxWidth: '800px', backgroundColor: 'white', padding: '30px', borderRadius: '15px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ margin: 0 }}>🏆 실시간 랭킹</h2>
          <button onClick={resetScores} style={{ padding: '10px 20px', backgroundColor: '#e74c3c', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
            기록 전체 초기화
          </button>
        </div>
        {loading ? <p>로딩 중...</p> : (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'center' }}>
            <thead>
              <tr style={{ backgroundColor: '#ecf0f1' }}>
                {scores.length > 0 ? Object.keys(scores[0]).map(key => <th key={key} style={{ padding: '12px' }}>{key.toUpperCase()}</th>) : <th style={{ padding: '12px' }}>데이터 없음</th>}
              </tr>
            </thead>
            <tbody>
              {scores.length === 0 ? <tr><td colSpan="100%" style={{ padding: '30px' }}>기록이 없습니다.</td></tr> : 
                scores.map((s, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid #eee' }}>
                    {Object.values(s).map((v, i) => <td key={i} style={{ padding: '12px' }}>{v}</td>)}
                  </tr>
                ))
              }
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default App;