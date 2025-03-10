import { useState } from 'react';

export default function VideoAnalysis() {
  const [file, setFile] = useState<File | null>(null);
  const [analysis, setAnalysis] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFile(file);
      setAnalysis(''); // Clear previous analysis when new file is selected
    }
  };

  const analyzeVideo = async () => {
    if (!file) return;

    setLoading(true);
    setAnalysis(''); // Clear previous analysis when starting new analysis
    
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/analyze-video`, {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      setAnalysis(data.analysis);
    } catch (error) {
      console.error('Error analyzing video:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4">
        <input
          type="file"
          accept="video/mp4"
          onChange={handleFileUpload}
          className="p-2 border rounded-lg"
        />
        <button
          onClick={analyzeVideo}
          disabled={!file || loading}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Analyzing...' : 'Analyze Video'}
        </button>
      </div>

      {analysis && (
        <div className="mt-4 p-4 bg-gray-800 rounded-lg">
          <h3 className="text-xl font-bold mb-2">Analysis Results:</h3>
          <p className="whitespace-pre-wrap">{analysis}</p>
        </div>
      )}
    </div>
  );
}
