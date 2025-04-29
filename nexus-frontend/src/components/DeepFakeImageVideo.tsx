import React, { useState, useRef } from "react";

interface ImageAnalysisResult {
  "CNN Prediction": "Real" | "Fake";
  "Metadata Analysis": string;
  "Artifact Analysis": string;
  "Noise Pattern Analysis": "Real" | "Fake";
  "Symmetry Analysis": {
    "Vertical Symmetry": number;
    "Horizontal Symmetry": number;
  };
  "Final Prediction": "Real" | "Fake";
  "Confidence Score": number;
}

const DeepFakeImageVideo = () => {
  const [file, setFile] = useState<File | null>(null);
  const [fileType, setFileType] = useState<"image" | "video">("image");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<ImageAnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    setResult(null);

    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];

      // Validate file type
      if (fileType === "image" && !selectedFile.type.startsWith("image/")) {
        setError("Please select an image file");
        return;
      }

      if (fileType === "video" && !selectedFile.type.startsWith("video/")) {
        setError("Please select a video file");
        return;
      }

      setFile(selectedFile);

      // Create preview
      const reader = new FileReader();
      reader.onload = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleSubmit = async () => {
    if (!file) {
      setError("Please select a file first");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const endpoint =
        fileType === "image"
          ? `${import.meta.env.VITE_API_URL}/deepfake/image`
          : `${import.meta.env.VITE_API_URL}/deepfake/video`;
      const response = await fetch(endpoint, {
        method: "POST",
        body: formData,
        headers: {
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      console.error("Error analyzing file:", err);
      setError("Failed to analyze the file. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFile(null);
    setPreview(null);
    setResult(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const getPredictionBadgeColor = (prediction: "Real" | "Fake") => {
    return prediction === "Real" ? "bg-green-500" : "bg-red-500";
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          DeepFake Detection
        </h1>

        <div className="bg-gray-800 rounded-lg shadow-xl p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-6 mb-6">
            <div className="flex-1">
              <h2 className="text-xl font-semibold mb-4">Upload File</h2>

              <div className="flex gap-4 mb-4">
                <button
                  onClick={() => {
                    setFileType("image");
                    resetForm();
                  }}
                  className={`px-4 py-2 rounded-md transition-colors ${
                    fileType === "image"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                  }`}
                >
                  Image
                </button>
                <button
                  onClick={() => {
                    setFileType("video");
                    resetForm();
                  }}
                  className={`px-4 py-2 rounded-md transition-colors ${
                    fileType === "video"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                  }`}
                >
                  Video
                </button>
              </div>

              <div
                className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center cursor-pointer hover:border-blue-500 transition-colors"
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                  accept={fileType === "image" ? "image/*" : "video/*"}
                />
                <div className="flex flex-col items-center">
                  <svg
                    className="w-12 h-12 text-gray-400 mb-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                  </svg>
                  <p className="text-gray-400 mb-1">
                    {file ? file.name : `Click to upload or drag and drop`}
                  </p>
                  <p className="text-gray-500 text-sm">
                    {fileType === "image"
                      ? "PNG, JPG, JPEG up to 10MB"
                      : "MP4, MOV up to 50MB"}
                  </p>
                </div>
              </div>

              {error && (
                <div className="mt-4 text-red-400 text-sm">{error}</div>
              )}

              <div className="mt-6 flex gap-4">
                <button
                  onClick={handleSubmit}
                  disabled={!file || isLoading}
                  className={`px-6 py-2 rounded-md bg-blue-600 text-white font-medium flex items-center justify-center ${
                    !file || isLoading
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:bg-blue-700"
                  }`}
                >
                  {isLoading ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Analyzing...
                    </>
                  ) : (
                    "Analyze"
                  )}
                </button>
                <button
                  onClick={resetForm}
                  className="px-6 py-2 rounded-md bg-gray-700 text-gray-300 font-medium hover:bg-gray-600"
                >
                  Reset
                </button>
              </div>
            </div>

            <div className="flex-1">
              {preview && (
                <div className="rounded-lg overflow-hidden bg-gray-700 border border-gray-600">
                  <div className="text-sm text-gray-400 p-2 bg-gray-800">
                    Preview
                  </div>
                  <div className="p-2">
                    {fileType === "image" ? (
                      <img
                        src={preview}
                        alt="Preview"
                        className="w-full h-auto rounded"
                      />
                    ) : (
                      <video
                        src={preview}
                        controls
                        className="w-full h-auto rounded"
                      />
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {result && (
          <div className="bg-gray-800 rounded-lg shadow-xl p-6 animate-fade-in">
            <h2 className="text-xl font-semibold mb-6 flex items-center">
              Analysis Results
              <span
                className={`ml-3 text-sm px-3 py-1 rounded-full ${getPredictionBadgeColor(
                  result["Final Prediction"]
                )}`}
              >
                {result["Final Prediction"]}
              </span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-700 p-4 rounded-lg">
                <h3 className="text-lg font-medium mb-3 text-gray-300">
                  CNN Prediction
                </h3>
                <div
                  className={`text-xl font-bold ${
                    result["CNN Prediction"] === "Real"
                      ? "text-green-400"
                      : "text-red-400"
                  }`}
                >
                  {result["CNN Prediction"]}
                </div>
              </div>

              <div className="bg-gray-700 p-4 rounded-lg">
                <h3 className="text-lg font-medium mb-3 text-gray-300">
                  Noise Pattern Analysis
                </h3>
                <div
                  className={`text-xl font-bold ${
                    result["Noise Pattern Analysis"] === "Real"
                      ? "text-green-400"
                      : "text-red-400"
                  }`}
                >
                  {result["Noise Pattern Analysis"]}
                </div>
              </div>

              <div className="bg-gray-700 p-4 rounded-lg">
                <h3 className="text-lg font-medium mb-3 text-gray-300">
                  Metadata Analysis
                </h3>
                <div className="text-gray-200">
                  {result["Metadata Analysis"]}
                </div>
              </div>

              <div className="bg-gray-700 p-4 rounded-lg">
                <h3 className="text-lg font-medium mb-3 text-gray-300">
                  Artifact Analysis
                </h3>
                <div className="text-gray-200">
                  {result["Artifact Analysis"]}
                </div>
              </div>

              <div className="bg-gray-700 p-4 rounded-lg">
                <h3 className="text-lg font-medium mb-3 text-gray-300">
                  Symmetry Analysis
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <p className="text-gray-400 text-sm">Vertical</p>
                    <p className="text-lg">
                      {result["Symmetry Analysis"]["Vertical Symmetry"].toFixed(
                        2
                      )}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Horizontal</p>
                    <p className="text-lg">
                      {result["Symmetry Analysis"][
                        "Horizontal Symmetry"
                      ].toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 p-4 bg-gray-700 rounded-lg">
              <h3 className="text-lg font-medium mb-3 text-gray-300">
                Final Verdict
              </h3>
              <div className="flex items-center">
                <div
                  className={`text-2xl font-bold ${
                    result["Final Prediction"] === "Real"
                      ? "text-green-400"
                      : "text-red-400"
                  }`}
                >
                  This {fileType} is {result["Final Prediction"].toLowerCase()}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DeepFakeImageVideo;
