import React, { useEffect, useState } from 'react';
import { Unity, useUnityContext } from "react-unity-webgl";

function App() {
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);

  // 유니티 컨텍스트 설정 (파일명: GameForder)
  const { unityProvider } = useUnityContext({
    loaderUrl: "/UnityGame/Build/GameForder.loader.js",
    dataUrl: "/UnityGame/Build/GameForder.data",
    frameworkUrl: "/UnityGame/Build/GameForder.framework.js",
    codeUrl: "/UnityGame/Build/GameForder.wasm",
  });

  // 실시간 점수 데이터 가져오기 (3초마다 업데이트)
  useEffect(() => {
    let isMounted = true;

    const fetchData = () => {
      fetch('/api/score')
        .then(res => res.json())
        .then(data => {
          if (isMounted) {
            setScores(data);
            setLoading(false);
          }
        })
        .catch(() => {
          if (isMounted) setLoading(false);
        });
    };

    fetchData(); 
    const interval = setInterval(fetchData, 3000); 

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  // 기록 초기화 함수
  const resetScores = async () => {
    if (window.confirm("정말로 모든 기록을 삭제하시겠습니까?")) {
      try {
        const response = await fetch('/api/score/all', {
          method: 'DELETE',
        });
        if (response.ok) {
          setScores([]); // 즉시 화면 비움
          alert("모든 기록이 초기화되었습니다!");
        } else {
          alert("초기화에 실패했습니다.");
        }
      } catch (error) {
        console.error("초기화 오류:", error);
        alert("서버와 연결할 수 없습니다.");
      }
    }
  };

  return (
    <div style={{ padding: 24, display: 'flex', flexDirection: 'column', alignItems: 'center', backgroundColor: '#f0f2f5', minHeight: '100vh' }}>
      <h1 style={{ color: '#2c3e50' }}>🎮 Express 로 Unity webGL 구동하기</h1>

      {/* 유니티 게임 화면 영역 */}
      <div style={{ 
        width: '800px', 
        height: '600px', 
        border: '8px solid #34495e', 
        borderRadius: '15px',
        overflow: 'hidden',
        backgroundColor: '#000',
        boxShadow: '0 10px 20px rgba(0,0,0,0.3)',
        marginBottom: '40px'
      }}>
        <Unity unityProvider={unityProvider} style={{ width: '100%', height: '100%' }} />
      </div>

      <div style={{ width: '100%', maxWidth: '800px', backgroundColor: 'white', padding: '30px', borderRadius: '15px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ margin: 0 }}>🏆 실시간 랭킹</h2>
          <button 
            onClick={resetScores}
            style={{
              padding: '10px 20px',
              backgroundColor: '#e74c3c',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 'bold',
              transition: 'background 0.3s'
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = '#c0392b'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#e74c3c'}
          >
            기록 전체 초기화
          </button>
        </div>

        {loading ? (
          <p>데이터를 불러오는 중입니다...</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'center' }}>
            <thead>
              <tr style={{ backgroundColor: '#ecf0f1', borderBottom: '2px solid #bdc3c7' }}>
                {scores.length > 0 ? (
                  Object.keys(scores[0]).map((key) => (
                    <th key={key} style={{ padding: '12px' }}>{key.toUpperCase()}</th>
                  ))
                ) : (
                  <th style={{ padding: '12px' }}>항목</th>
                )}
              </tr>
            </thead>
            <tbody>
              {scores.length === 0 ? (
                <tr>
                  <td colSpan="100%" style={{ padding: '30px', color: '#7f8c8d' }}>등록된 기록이 없습니다. 게임을 완료해 보세요!</td>
                </tr>
              ) : (
                scores.map((score, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid #eee' }}>
                    {Object.values(score).map((val, i) => (
                      <td key={i} style={{ padding: '12px' }}>{val}</td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default App;