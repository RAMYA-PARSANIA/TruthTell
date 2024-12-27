import { useEffect, useState } from "react";

// todo fix types
const FactCheckStream = () => {
  const [factChecks, setFactChecks] = useState([]);

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8000/ws/factcheck-stream");

    ws.onmessage = (event) => {
      const result = JSON.parse(event.data);
      setFactChecks((prev) => [result, ...prev]);
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    return () => {
      ws.close();
    };
  }, []);

  return (
    <div>
      <h2>Live Fact Checks</h2>
      {factChecks.map((check, index) => (
        <div key={index} className="fact-check-card">
          <h3>{check.title}</h3>
          <p>{check.text}</p>
          <div className="verification-result">
            <span>Verdict: {check.result}</span>
            <p>Evidence: {check.evidence}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FactCheckStream;
