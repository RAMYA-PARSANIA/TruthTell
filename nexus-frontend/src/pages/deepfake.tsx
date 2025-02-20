// import { useState } from "react";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
// import { Progress } from "@/components/ui/progress";
// import { Upload, AlertCircle } from "lucide-react";

// interface DetectionResult {
//   CNN_Prediction: string;
//   Metadata_Analysis: string;
//   Artifact_Analyis: string;
//   Noise_Pattern_Analysis: string;
//   Symmetry_Analysis: {
//     Vertical_Symmetry: number;
//     Horizontal_Symmetry: number;
//   };
//   Final_Prediction: string;
//   Confidence_Score: number;
// }

// export default function DeepfakeDetection() {
//   const [selectedFile, setSelectedFile] = useState<File | null>(null);
//   const [result, setResult] = useState<DetectionResult | null>(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
//     setError(null);
//     const files = event.target.files;

//     if (!files || files.length === 0) {
//       setError("Please select a file");
//       return;
//     }

//     const file = files[0];
//     const validTypes = ["image/jpeg", "image/png", "video/mp4"];
//     const maxSize = 10 * 1024 * 1024; // 10MB

//     if (!validTypes.includes(file.type)) {
//       setError("Please upload a valid image (JPEG/PNG) or video (MP4)");
//       return;
//     }

//     if (file.size > maxSize) {
//       setError("File size must be less than 10MB");
//       return;
//     }

//     setSelectedFile(file);
//   };

//   const handleUpload = async () => {
//     if (!selectedFile) return;

//     setLoading(true);
//     setError(null);
//     const formData = new FormData();
//     formData.append("file", selectedFile);

//     try {
//       const response = await fetch("http://localhost:8000/analyze-deepfake", {
//         method: "POST",
//         body: formData,
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.detail?.message || "Upload failed");
//       }

//       const data = await response.json();
//       console.log("Results: ")
//       console.log(data.results.Confidence_Score);
//       setResult(data.results);
//     } catch (error) {
//       setError(
//         error instanceof Error ? error.message : "An unexpected error occurred"
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="container mx-auto max-w-3xl py-10">
//       <Card className="bg-slate-950 border-slate-800">
//         <CardHeader>
//           <CardTitle className="text-center text-slate-50">
//             Deepfake Detection
//           </CardTitle>
//         </CardHeader>
//         <CardContent className="space-y-6">
//           <div className="flex flex-col items-center gap-4">
//             <Input
//               id="file-upload"
//               type="file"
//               accept="image/jpeg,image/png,video/mp4"
//               onChange={handleFileSelect}
//               className="max-w-sm bg-slate-100 hover:bg-slate-700 text-slate-50 py-2 px-4 rounded"
//             />

//             {selectedFile && (
//               <div className="text-center">
//                 <p className="text-sm text-slate-400">
//                   Selected: {selectedFile.name}
//                 </p>
//                 {selectedFile.type.startsWith("image/") && (
//                   <div className="mt-4">
//                     <img
//                       src={URL.createObjectURL(selectedFile)}
//                       alt="Preview"
//                       className="mx-auto max-h-[300px] rounded-lg object-contain border border-slate-800"
//                     />
//                   </div>
//                 )}
//               </div>
//             )}

//             <Button
//               onClick={handleUpload}
//               disabled={!selectedFile || loading}
//               className="w-32 bg-slate-800 hover:bg-slate-700 text-slate-50"
//             >
//               {loading ? (
//                 <>
//                   <Upload className="mr-2 h-4 w-4 animate-spin" />
//                   Analyzing
//                 </>
//               ) : (
//                 "Analyze"
//               )}
//             </Button>
//           </div>

//           {loading && <Progress value={30} className="w-full bg-slate-800" />}

//           {error && (
//             <Alert variant="destructive" className="bg-red-900 border-red-800">
//               <AlertCircle className="h-4 w-4" />
//               <AlertTitle>Error</AlertTitle>
//               <AlertDescription>{error}</AlertDescription>
//             </Alert>
//           )}

//           {result && (
//             <div className="space-y-4">
//               <Alert
//                 variant={result.Confidence_Score > 0.5 ? "destructive" : "default"}
//                 className={
//                   result.Confidence_Score > 0.5
//                     ? "bg-red-900 border-red-800"
//                     : "bg-green-900 border-green-800"
//                 }
//               >
//                 <AlertTitle className="text-slate-50">
//                   {result.Confidence_Score > 0.5
//                     ? "Potential deepfake detected"
//                     : "No deepfake detected"}
//                 </AlertTitle>
//                 { /*<AlertDescription className="text-slate-200">
//                   Probability: {(result.Confidence_Score * 100)}%
//                 </AlertDescription>*/ }
//               </Alert>
            
//               <div className="rounded-lg border border-slate-800 bg-slate-900 p-4">
//                 <h3 className="font-semibold text-slate-50">Detection Results</h3>
//                 <p className="text-slate-200">Classification: {result.Final_Prediction}</p>
//               </div>
            
//               <div className="rounded-lg border border-slate-800 bg-slate-900 p-4">
//                 <h3 className="font-semibold text-slate-50">CNN Analysis</h3>
//                 <p className="text-slate-200">Result: {result.CNN_Prediction}</p>
//               </div>
            
//               <div className="rounded-lg border border-slate-800 bg-slate-900 p-4">
//                 <h3 className="font-semibold text-slate-50">Metadata Analysis</h3>
//                 <p className="text-slate-200">Findings: {result.Metadata_Analysis}</p>
//               </div>
            
            
//               <div className="rounded-lg border border-slate-800 bg-slate-900 p-4">
//                 <h3 className="font-semibold text-slate-50">Noise Pattern Analysis</h3>
//                 <p className="text-slate-200">Results: {result.Noise_Pattern_Analysis}</p>
//               </div>
            
              
//           </div>
          
            
//           )}
//         </CardContent>
//       </Card>
//     </div>
//   );
// }

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Upload, AlertCircle } from "lucide-react";

interface DetectionResult {
  CNN_Prediction: string;
  Metadata_Analysis: string;
  Artifact_Analyis: string;
  Noise_Pattern_Analysis: string;
  Symmetry_Analysis: {
    Vertical_Symmetry: number;
    Horizontal_Symmetry: number;
  };
  Final_Prediction: string;
  Confidence_Score: number;
}

export default function DeepfakeDetection() {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<File | null>(null);
  const [result, setResult] = useState<DetectionResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const files = event.target.files;
    if (!files || files.length === 0) return;
    
    const file = files[0];
    const validTypes = ["image/jpeg", "image/png"];
    const maxSize = 10 * 1024 * 1024;

    if (!validTypes.includes(file.type)) {
      setError("Please upload a valid image (JPEG/PNG)");
      return;
    }
    if (file.size > maxSize) {
      setError("File size must be less than 10MB");
      return;
    }
    setSelectedImage(file);
    setSelectedVideo(null);
  };

  const handleVideoSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    const validTypes = ["video/mp4"];
    const maxSize = 10 * 1024 * 1024;

    if (!validTypes.includes(file.type)) {
      setError("Please upload a valid video (MP4)");
      return;
    }
    if (file.size > maxSize) {
      setError("File size must be less than 10MB");
      return;
    }
    setSelectedVideo(file);
    setSelectedImage(null);
  };

  const handleUpload = async () => {
    const fileToUpload = selectedImage || selectedVideo;
    if (!fileToUpload) return;

    setLoading(true);
    setError(null);
    const formData = new FormData();
    formData.append("file", fileToUpload);

    try {
        // Different endpoints for image and video analysis
        const endpoint = fileToUpload.type.startsWith('video') 
            ? "http://localhost:8000/analyze-video"
            : "http://localhost:8000/analyze-deepfake";

        const response = await fetch(endpoint, {
            method: "POST",
            body: formData,
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || "Upload failed");
        }

        const data = await response.json();
        setResult(data.results);
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
            <div className="flex gap-4">
              <div className="flex flex-col items-center">
                <Input
                  id="image-upload"
                  type="file"
                  accept="image/jpeg,image/png"
                  onChange={handleImageSelect}
                  className="max-w-sm bg-slate-100 hover:bg-slate-700 text-slate-50 py-2 px-4 rounded"
                />
                <label className="text-sm text-slate-400">Image Upload</label>
              </div>
              
              <div className="flex flex-col items-center">
                <Input
                  id="video-upload"
                  type="file"
                  accept="video/mp4"
                  onChange={handleVideoSelect}
                  className="max-w-sm bg-slate-100 hover:bg-slate-700 text-slate-50 py-2 px-4 rounded"
                />
                <label className="text-sm text-slate-400">Video Upload</label>
              </div>
            </div>

            {selectedImage && (
              <div className="text-center">
                <p className="text-sm text-slate-400">
                  Selected Image: {selectedImage.name}
                </p>
                <div className="mt-4">
                  <img
                    src={URL.createObjectURL(selectedImage)}
                    alt="Preview"
                    className="mx-auto max-h-[300px] rounded-lg object-contain border border-slate-800"
                  />
                </div>
              </div>
            )}

            {selectedVideo && (
              <div className="text-center">
                <p className="text-sm text-slate-400">
                  Selected Video: {selectedVideo.name}
                </p>
              </div>
            )}

            <Button
              onClick={handleUpload}
              disabled={!selectedImage && !selectedVideo || loading}
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
                variant={result.Confidence_Score > 0.5 ? "destructive" : "default"}
                className={
                  result.Confidence_Score > 0.5
                    ? "bg-red-900 border-red-800"
                    : "bg-green-900 border-green-800"
                }
              >
                <AlertTitle className="text-slate-50">
                  {result.Confidence_Score > 0.5
                    ? "Potential deepfake detected"
                    : "No deepfake detected"}
                </AlertTitle>
              </Alert>
            
              <div className="rounded-lg border border-slate-800 bg-slate-900 p-4">
                <h3 className="font-semibold text-slate-50">Detection Results</h3>
                <p className="text-slate-200">Classification: {result.Final_Prediction}</p>
              </div>
            
              <div className="rounded-lg border border-slate-800 bg-slate-900 p-4">
                <h3 className="font-semibold text-slate-50">CNN Analysis</h3>
                <p className="text-slate-200">Result: {result.CNN_Prediction}</p>
              </div>
            
              <div className="rounded-lg border border-slate-800 bg-slate-900 p-4">
                <h3 className="font-semibold text-slate-50">Metadata Analysis</h3>
                <p className="text-slate-200">Findings: {result.Metadata_Analysis}</p>
              </div>
            
              <div className="rounded-lg border border-slate-800 bg-slate-900 p-4">
                <h3 className="font-semibold text-slate-50">Noise Pattern Analysis</h3>
                <p className="text-slate-200">Results: {result.Noise_Pattern_Analysis}</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}