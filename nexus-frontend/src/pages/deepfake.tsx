import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Upload, AlertCircle } from "lucide-react";

interface DetectionResult {
  probability: number;
  classification: string;
  metadata: {
    timestamp: string;
    file_hash: string;
    processing_time: number;
  };
}

export default function DeepfakeDetection() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [result, setResult] = useState<DetectionResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const files = event.target.files;

    if (!files || files.length === 0) {
      setError("Please select a file");
      return;
    }

    const file = files[0];
    const validTypes = ["image/jpeg", "image/png", "video/mp4"];
    const maxSize = 10 * 1024 * 1024; // 10MB

    if (!validTypes.includes(file.type)) {
      setError("Please upload a valid image (JPEG/PNG) or video (MP4)");
      return;
    }

    if (file.size > maxSize) {
      setError("File size must be less than 10MB");
      return;
    }

    setSelectedFile(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setLoading(true);
    setError(null);
    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await fetch("http://localhost:8000/analyze-deepfake", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail?.message || "Upload failed");
      }

      const data = await response.json();
      setResult(data);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "An unexpected error occurred"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto max-w-3xl py-10">
      <Card className="bg-slate-950 border-slate-800">
        <CardHeader>
          <CardTitle className="text-center text-slate-50">
            Deepfake Detection
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col items-center gap-4">
            <Input
              id="file-upload"
              type="file"
              accept="image/jpeg,image/png,video/mp4"
              onChange={handleFileSelect}
              className="max-w-sm bg-slate-900 border-slate-800 text-slate-50"
            />

            {selectedFile && (
              <div className="text-center">
                <p className="text-sm text-slate-400">
                  Selected: {selectedFile.name}
                </p>
                {selectedFile.type.startsWith("image/") && (
                  <div className="mt-4">
                    <img
                      src={URL.createObjectURL(selectedFile)}
                      alt="Preview"
                      className="mx-auto max-h-[300px] rounded-lg object-contain border border-slate-800"
                    />
                  </div>
                )}
              </div>
            )}

            <Button
              onClick={handleUpload}
              disabled={!selectedFile || loading}
              className="w-32 bg-slate-800 hover:bg-slate-700 text-slate-50"
            >
              {loading ? (
                <>
                  <Upload className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing
                </>
              ) : (
                "Analyze"
              )}
            </Button>
          </div>

          {loading && <Progress value={30} className="w-full bg-slate-800" />}

          {error && (
            <Alert variant="destructive" className="bg-red-900 border-red-800">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {result && (
            <div className="space-y-4">
              <Alert
                variant={result.probability > 0.5 ? "destructive" : "default"}
                className={
                  result.probability > 0.5
                    ? "bg-red-900 border-red-800"
                    : "bg-green-900 border-green-800"
                }
              >
                <AlertTitle className="text-slate-50">
                  {result.probability > 0.5
                    ? "Potential deepfake detected"
                    : "No deepfake detected"}
                </AlertTitle>
                <AlertDescription className="text-slate-200">
                  Probability: {(result.probability * 100).toFixed(2)}%
                </AlertDescription>
              </Alert>

              <div className="rounded-lg border border-slate-800 bg-slate-900 p-4">
                <h3 className="font-semibold text-slate-50">
                  Detection Results
                </h3>
                <p className="text-slate-200">
                  Classification: {result.classification}
                </p>
                <p className="text-sm text-slate-400">
                  Processing Time: {result.metadata.processing_time.toFixed(2)}s
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
