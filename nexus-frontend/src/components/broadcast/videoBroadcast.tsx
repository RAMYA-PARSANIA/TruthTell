import {
  LocalUser,
  RemoteUser,
  useIsConnected,
  useJoin,
  useLocalMicrophoneTrack,
  useLocalCameraTrack,
  usePublish,
  useRemoteUsers,
} from "agora-rtc-react";
import { useEffect, useRef, useState } from "react";
import AgoraRTC, { AgoraRTCProvider } from "agora-rtc-react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  PhoneOff,
  AlertTriangle,
  CheckCircle,
  HelpCircle,
  XCircle,
  Radio,
  Users,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { ScrollArea } from "../ui/scroll-area";

// Add TypeScript declarations for Web Speech API
interface SpeechRecognitionEvent extends Event {
  resultIndex: number;
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionResultList {
  length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  isFinal: boolean;
  length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message: string;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  abort(): void;
  onresult: (event: SpeechRecognitionEvent) => void;
  onerror: (event: SpeechRecognitionErrorEvent) => void;
  onend: (event: Event) => void;
}

// Fact check analysis response types
interface Claim {
  statement: string;
  accuracy: string;
  explanation: string;
}

interface FactCheckAnalysis {
  summary: string;
  claims: Claim[];
}

interface FactCheckResponse {
  timestamp: string;
  source: string;
  title: string;
  analysis: FactCheckAnalysis;
}

// Add global declarations
declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition;
    webkitSpeechRecognition: new () => SpeechRecognition;
  }
}

function setupSpeechRecognition(
  addFactCheckResult: (result: FactCheckResponseWithTranscript) => void
) {
  if (
    !("webkitSpeechRecognition" in window) &&
    !("SpeechRecognition" in window)
  ) {
    console.error("Speech recognition not supported in this browser");
    return null;
  }

  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new SpeechRecognition();
  recognition.continuous = true;
  recognition.interimResults = true;
  recognition.lang = "en-US";

  let transcriptBuffer = "";
  const sendInterval = 10;
  let lastSendTime = Date.now();
  let api_url1 = import.meta.env.VITE_API_URL1;

  const sendTranscript = async (transcript: string) => {
    if (!transcript.trim()) return;
    try {
      const response = await fetch(`${api_url1}/fact-check-transcript`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transcript }),
      });

      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}`);
      }

      const analysisResults: FactCheckResponse = await response.json();
      addFactCheckResult({ ...analysisResults, transcript });
    } catch (error) {
      console.error("Error sending transcript to backend:", error);
    }
  };

  recognition.onresult = (event: SpeechRecognitionEvent) => {
    let interimTranscript = "";
    let finalTranscript = "";

    for (let i = event.resultIndex; i < event.results.length; i++) {
      const transcript = event.results[i][0].transcript;
      if (event.results[i].isFinal) {
        finalTranscript += transcript;
      } else {
        interimTranscript += transcript;
      }
    }

    if (finalTranscript) {
      transcriptBuffer += " " + finalTranscript;
    }

    const now = Date.now();
    if (now - lastSendTime > sendInterval && transcriptBuffer.trim()) {
      sendTranscript(transcriptBuffer.trim());
      transcriptBuffer = "";
      lastSendTime = now;
    }
  };

  recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
    console.error("Speech recognition error:", event.error);
    if (event.error !== "no-speech") {
      recognition.stop();
      setTimeout(() => recognition.start(), 1000);
    }
  };

  recognition.start();

  return () => {
    recognition.stop();
    if (transcriptBuffer.trim()) {
      sendTranscript(transcriptBuffer.trim());
    }
  };
}

interface FactCheckResponseWithTranscript extends FactCheckResponse {
  transcript: string;
}

const FactCheckModalList = ({
  results,
}: {
  results: FactCheckResponseWithTranscript[];
}) => {
  if (results.length === 0) return null;

  return (
    <Card className="border border-indigo-100 shadow-md bg-white">
      <CardHeader className="rounded-xl bg-gradient-to-r from-indigo-50 to-blue-50 border-b border-indigo-100">
        <CardTitle className="flex items-center gap-2 text-indigo-800">
          <AlertTriangle className="h-5 w-5 text-amber-500" />
          Fact Check History
        </CardTitle>
        <CardDescription className="text-indigo-600">
          Click on an entry to view full analysis of that transcript.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4">
        <ScrollArea className="h-[300px] pr-4">
          <div className="space-y-3">
            {results.map((result, idx) => (
              <Dialog key={idx}>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full h-16 justify-start text-left hover:bg-indigo-50 hover:border-indigo-200 transition-all duration-200 group"
                  >
                    <div className="flex items-start gap-3">
                      <div className="bg-indigo-100 p-2 rounded-full text-indigo-600 group-hover:bg-indigo-200">
                        <AlertTriangle className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-sm font-medium truncate text-indigo-800">
                          {result.transcript.slice(0, 80)}...
                        </p>
                        <p className="text-xs text-indigo-500 mt-1">
                          {new Date(result.timestamp).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[80vh] font-main2">
                  <DialogHeader>
                    <DialogTitle className="text-xl text-indigo-800 font-bold">
                      Transcript Analysis
                    </DialogTitle>
                  </DialogHeader>
                  <ScrollArea className="max-h-[calc(80vh-120px)]">
                    <div className="space-y-4">
                      <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100">
                        <p className="text-sm text-indigo-800">
                          <strong>Transcript:</strong> {result.transcript}
                        </p>
                      </div>
                      <Alert className="bg-blue-50 border-blue-200">
                        <AlertTitle className="text-blue-800 font-bold flex items-center gap-2">
                          <CheckCircle className="h-5 w-5 text-blue-600" />
                          Summary
                        </AlertTitle>
                        <AlertDescription className="text-blue-700">
                          {result.analysis.summary}
                        </AlertDescription>
                      </Alert>
                      <div className="space-y-3">
                        <h4 className="font-medium text-indigo-800 text-lg">
                          Claims:
                        </h4>
                        {result.analysis.claims.map((claim, index) => {
                          const getAccuracyStyles = (accuracy: string) => {
                            if (accuracy.toLowerCase().includes("accurate")) {
                              return {
                                icon: (
                                  <CheckCircle className="h-5 w-5 text-emerald-500" />
                                ),
                                bgColor: "bg-emerald-50",
                                borderColor: "border-emerald-200",
                                badgeColor: "bg-emerald-100 text-emerald-700",
                              };
                            } else if (
                              accuracy.toLowerCase().includes("inaccurate")
                            ) {
                              return {
                                icon: (
                                  <XCircle className="h-5 w-5 text-red-500" />
                                ),
                                bgColor: "bg-red-50",
                                borderColor: "border-red-200",
                                badgeColor: "bg-red-100 text-red-700",
                              };
                            } else if (
                              accuracy.toLowerCase().includes("partially")
                            ) {
                              return {
                                icon: (
                                  <AlertTriangle className="h-5 w-5 text-amber-500" />
                                ),
                                bgColor: "bg-amber-50",
                                borderColor: "border-amber-200",
                                badgeColor: "bg-amber-100 text-amber-700",
                              };
                            } else {
                              return {
                                icon: (
                                  <HelpCircle className="h-5 w-5 text-gray-500" />
                                ),
                                bgColor: "bg-gray-50",
                                borderColor: "border-gray-200",
                                badgeColor: "bg-gray-100 text-gray-700",
                              };
                            }
                          };

                          const styles = getAccuracyStyles(claim.accuracy);

                          return (
                            <div
                              key={index}
                              className={`border rounded-lg p-4 flex gap-3 ${styles.bgColor} ${styles.borderColor} shadow-sm`}
                            >
                              {styles.icon}
                              <div>
                                <p className="font-medium text-gray-800">
                                  {claim.statement}
                                </p>
                                <Badge
                                  variant="outline"
                                  className={`mt-2 ${styles.badgeColor}`}
                                >
                                  {claim.accuracy}
                                </Badge>
                                <p className="text-sm mt-2 text-gray-700">
                                  {claim.explanation}
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </ScrollArea>
                </DialogContent>
              </Dialog>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export const InteractiveLiveStreaming = () => {
  const [role, setRole] = useState("host");

  const client = AgoraRTC.createClient({
    mode: "live",
    codec: "vp8",
    role: "host",
  });

  return (
    <AgoraRTCProvider client={client}>
      <div className="max-w-6xl mx-auto p-6">
        <Card className="mb-6 bg-gradient-to-br from-indigo-600 via-blue-600 to-indigo-700 border-0 shadow-xl overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
          <CardHeader className="relative z-10">
            <CardTitle className="text-3xl font-bold text-white flex items-center gap-2">
              <Radio className="h-6 w-6 text-indigo-300" />
              Nexus of Truth Live Broadcast
            </CardTitle>
            <CardDescription className="text-blue-100 text-lg">
              Real-time misinformation detection during live broadcasts
            </CardDescription>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="flex items-center space-x-4 bg-white/10 p-3 rounded-lg backdrop-blur-sm">
              <span className="text-white font-medium">Select Role:</span>
              <Select
                value={role}
                onValueChange={(value) => {
                  setRole(value);
                  if (value === "host") client.setClientRole("host");
                  if (value === "audience") client.setClientRole("audience");
                }}
              >
                <SelectTrigger className="w-[180px] bg-white/20 text-white border-blue-400 focus:ring-blue-300 backdrop-blur-sm">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="host">Host</SelectItem>
                  <SelectItem value="audience">Audience</SelectItem>
                </SelectContent>
              </Select>
              <Badge
                variant="outline"
                className={`${
                  role === "host"
                    ? "bg-emerald-500 text-white"
                    : "bg-blue-500 text-white"
                } border-none px-3 py-1 text-sm font-medium`}
              >
                {role === "host" ? "Broadcasting" : "Viewing"}
              </Badge>
            </div>
          </CardContent>
        </Card>
        <Basics />
      </div>
    </AgoraRTCProvider>
  );
};

const Basics = () => {
  const [calling, setCalling] = useState(false);
  const isConnected = useIsConnected();
  const [appId] = useState(import.meta.env.VITE_AGORA_APP_ID || "");
  const [channel, setChannel] = useState("ABP");
  const [token] = useState(import.meta.env.VITE_CHANNEL_TOKEN || "");
  const [micOn, setMic] = useState(true);
  const [cameraOn, setCamera] = useState(true);
  const cleanupRef = useRef<(() => void) | null>(null);
  const [factCheckResults, setFactCheckResults] = useState<
    FactCheckResponseWithTranscript[]
  >([]);

  const { localMicrophoneTrack } = useLocalMicrophoneTrack(micOn);
  const { localCameraTrack } = useLocalCameraTrack(cameraOn);

  useJoin(
    { appid: appId, channel: channel, token: token ? token : null },
    calling
  );
  usePublish([localMicrophoneTrack, localCameraTrack]);

  const remoteUsers = useRemoteUsers();

  useEffect(() => {
    if (micOn && isConnected) {
      const cleanup = setupSpeechRecognition((newResult) => {
        setFactCheckResults((prev) => [newResult, ...prev]);
      });
      if (cleanup) cleanupRef.current = cleanup;
    }

    return () => {
      if (cleanupRef.current) {
        cleanupRef.current();
        cleanupRef.current = null;
      }
    };
  }, [micOn, isConnected]);

  return (
    <>
      {!isConnected ? (
        <Card className="border border-indigo-100 shadow-lg bg-white">
          <CardHeader className="rounded-xl bg-gradient-to-r from-indigo-50 to-blue-50 border-b border-indigo-100">
            <CardTitle className="text-xl text-indigo-800 flex items-center gap-2">
              <Radio className="h-5 w-5 text-indigo-600" />
              Join Broadcast
            </CardTitle>
            <CardDescription className="text-indigo-600">
              Enter the channel name of the broadcast you want to join.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-6">
              <div className="space-y-2">
                <Label
                  htmlFor="channel"
                  className="text-indigo-800 font-medium"
                >
                  Channel Name
                </Label>
                <div className="relative">
                  <Input
                    id="channel"
                    onChange={(e) => setChannel(e.target.value)}
                    placeholder="Enter channel name"
                    value={channel}
                    className="pl-10 border-indigo-200 focus:border-indigo-400 focus:ring-indigo-300"
                  />
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-400">
                    <Radio className="h-4 w-4" />
                  </div>
                </div>
              </div>
              <Button
                disabled={!appId || !channel}
                onClick={() => setCalling(true)}
                className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 transition-all duration-300 shadow-md"
              >
                Join Channel
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-0 overflow-hidden border-0 bg-gray-900 shadow-xl rounded-xl">
              <div className="relative" style={{ height: "400px" }}>
                <LocalUser
                  audioTrack={localMicrophoneTrack}
                  cameraOn={cameraOn}
                  playAudio={false}
                  micOn={micOn}
                  videoTrack={localCameraTrack}
                  style={{ width: "100%", height: "100%" }}
                >
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                    <div className="flex items-center justify-between">
                      <div className="bg-black/60 px-3 py-1 rounded-full text-white font-medium flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></div>
                        <span>You (Live)</span>
                        {!micOn && <MicOff className="h-4 w-4 text-red-400" />}
                        {!cameraOn && (
                          <VideoOff className="h-4 w-4 text-red-400" />
                        )}
                      </div>
                      <Badge
                        variant="outline"
                        className="bg-indigo-500/70 text-white border-none"
                      >
                        Host
                      </Badge>
                    </div>
                  </div>
                </LocalUser>
              </div>
            </Card>
            {remoteUsers.map((user) => (
              <Card
                key={user.uid}
                className="p-0 overflow-hidden border-0 bg-gray-900 shadow-xl rounded-xl"
              >
                <div className="relative" style={{ height: "400px" }}>
                  <RemoteUser
                    user={user}
                    style={{ width: "100%", height: "100%" }}
                  >
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                      <div className="flex items-center justify-between">
                        <div className="bg-black/60 px-3 py-1 rounded-full text-white font-medium flex items-center gap-2">
                          <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse"></div>
                          <span>User {user.uid}</span>
                        </div>
                        <Badge
                          variant="outline"
                          className="bg-blue-500/70 text-white border-none"
                        >
                          Viewer
                        </Badge>
                      </div>
                    </div>
                  </RemoteUser>
                </div>
              </Card>
            ))}
          </div>

          <Card className="border border-indigo-100 shadow-md bg-white">
            <CardContent className="p-4">
              <div className="flex flex-wrap justify-center gap-4 py-2">
                <Button
                  onClick={() => setMic((a) => !a)}
                  variant={micOn ? "outline" : "destructive"}
                  className={`px-6 rounded-full ${
                    micOn
                      ? "border-indigo-200 text-indigo-700 hover:bg-indigo-50"
                      : "bg-red-500 hover:bg-red-600"
                  }`}
                >
                  {micOn ? (
                    <>
                      <Mic className="mr-2 h-4 w-4" /> Mute Microphone
                    </>
                  ) : (
                    <>
                      <MicOff className="mr-2 h-4 w-4" /> Unmute Microphone
                    </>
                  )}
                </Button>

                <Button
                  onClick={() => setCamera((a) => !a)}
                  variant={cameraOn ? "outline" : "destructive"}
                  className={`px-6 rounded-full ${
                    cameraOn
                      ? "border-indigo-200 text-indigo-700 hover:bg-indigo-50"
                      : "bg-red-500 hover:bg-red-600"
                  }`}
                >
                  {cameraOn ? (
                    <>
                      <Video className="mr-2 h-4 w-4" /> Turn Off Camera
                    </>
                  ) : (
                    <>
                      <VideoOff className="mr-2 h-4 w-4" /> Turn On Camera
                    </>
                  )}
                </Button>

                <Button
                  onClick={() => setCalling((a) => !a)}
                  variant="destructive"
                  className="px-6 rounded-full bg-red-600 hover:bg-red-700 shadow-md"
                >
                  <PhoneOff className="mr-2 h-4 w-4" /> End Broadcast
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card className="border border-indigo-100 shadow-md bg-white">
                <CardHeader className="rounded-xl bg-gradient-to-r from-indigo-50 to-blue-50 border-b border-indigo-100">
                  <CardTitle className="flex items-center gap-2 text-indigo-800">
                    <Users className="h-5 w-5 text-indigo-600" />
                    Broadcast Information
                  </CardTitle>
                  <CardDescription className="text-indigo-600">
                    Current broadcast details and statistics
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-100">
                      <h3 className="text-sm font-medium text-indigo-800 mb-2">
                        Channel Information
                      </h3>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-indigo-600">Channel Name:</span>
                          <span className="font-medium text-indigo-900">
                            {channel}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-indigo-600">Status:</span>
                          <span className="font-medium text-emerald-600">
                            Live
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-indigo-600">Role:</span>
                          <span className="font-medium text-indigo-900">
                            Host
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                      <h3 className="text-sm font-medium text-blue-800 mb-2">
                        Audience Information
                      </h3>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-blue-600">Viewers:</span>
                          <span className="font-medium text-blue-900">
                            {remoteUsers.length}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-blue-600">Microphone:</span>
                          <span
                            className={`font-medium ${
                              micOn ? "text-emerald-600" : "text-red-600"
                            }`}
                          >
                            {micOn ? "Active" : "Muted"}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-blue-600">Camera:</span>
                          <span
                            className={`font-medium ${
                              cameraOn ? "text-emerald-600" : "text-red-600"
                            }`}
                          >
                            {cameraOn ? "Active" : "Off"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            <div className="lg:col-span-1">
              <Card className="border rounded-xl border-indigo-100 shadow-md bg-white h-full">
                <CardHeader className="rounded-xl bg-gradient-to-r from-indigo-50 to-blue-50 border-b border-indigo-100">
                  <CardTitle className="flex items-center gap-2 text-indigo-800">
                    <AlertTriangle className="h-5 w-5 text-amber-500" />
                    Fact Check Status
                  </CardTitle>
                  <CardDescription className="text-indigo-600">
                    Real-time fact checking status
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="flex flex-col items-center justify-center h-full">
                    {factCheckResults.length > 0 ? (
                      <div className="text-center">
                        <div className="bg-amber-100 p-3 rounded-full inline-flex items-center justify-center mb-3">
                          <AlertTriangle className="h-6 w-6 text-amber-600" />
                        </div>
                        <p className="text-indigo-800 font-medium">
                          {factCheckResults.length} fact check
                          {factCheckResults.length !== 1 ? "s" : ""} performed
                        </p>
                        <p className="text-indigo-600 text-sm mt-1">
                          View detailed analysis below
                        </p>
                      </div>
                    ) : (
                      <div className="text-center">
                        <div className="bg-emerald-100 p-3 rounded-full inline-flex items-center justify-center mb-3">
                          <CheckCircle className="h-6 w-6 text-emerald-600" />
                        </div>
                        <p className="text-indigo-800 font-medium">
                          No fact checks yet
                        </p>
                        <p className="text-indigo-600 text-sm mt-1">
                          Speak to activate fact checking
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <FactCheckModalList results={factCheckResults} />
        </div>
      )}
    </>
  );
};

export default InteractiveLiveStreaming;
