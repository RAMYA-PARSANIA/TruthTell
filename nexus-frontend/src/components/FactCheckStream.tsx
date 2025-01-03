import { useEffect, useState } from "react";

interface CorrectionSource {
  text: string;
  url: string;
}

interface Claim {
  claim: string;
  verification_status: string;
}

interface MetaAnalysis {
  information_ecosystem_impact: string;
  recommended_actions: string[];
}

interface OverallAnalysis {
  key_findings: string[];
  patterns_identified: string[];
  reliability_assessment: string;
  truth_score: number;
}

interface DetailedAnalysis {
  claim_analysis: Claim[];
  meta_analysis: MetaAnalysis;
  overall_analysis: OverallAnalysis;
}

interface Result {
  timestamp: string;
  original_text: string;
  detailed_analysis: DetailedAnalysis;
  correction_sources: {
    [key: string]: {
      [key: string]: CorrectionSource[];
    };
  };
  url: string;
  title: string;
  summary: string;
}

interface ApiResponse {
  result: Result;
}

const FactCheckStream = () => {
  const [factChecks, setFactChecks] = useState<ApiResponse[] | []>([]);

  useEffect(() => {
    const ws = new WebSocket("http://localhost:8000/ws/factcheck-stream");

    ws.onmessage = (event) => {
      const result = JSON.parse(event.data);
      console.log(result);
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

        </div>
      ))}
    </div>
  );
};

export default FactCheckStream;
