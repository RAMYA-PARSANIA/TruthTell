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
  const api_url1 = import.meta.env.VITE_API_URL1;

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
    let finalTranscript = "";

    for (let i = event.resultIndex; i < event.results.length; i++) {
      const transcript = event.results[i][0].transcript;
      if (event.results[i].isFinal) {
        finalTranscript += transcript;
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
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-yellow-500" />
          Fact Check History
        </CardTitle>
        <CardDescription>
          Click on an entry to view full analysis of that transcript.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px]">
          <div className="space-y-3">
            {results.map((result, idx) => (
              <Dialog key={idx}>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left"
                  >
                    <div>
                      <p className="text-sm font-medium truncate">
                        {result.transcript.slice(0, 80)}...
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(result.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[80vh]">
                  <DialogHeader>
                    <DialogTitle>Transcript Analysis</DialogTitle>
                  </DialogHeader>
                  <ScrollArea className="max-h-[calc(80vh-120px)]">
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">
                        <strong>Transcript:</strong> {result.transcript}
                      </p>
                      <Alert>
                        <AlertTitle>Summary</AlertTitle>
                        <AlertDescription>
                          {result.analysis.summary}
                        </AlertDescription>
                      </Alert>
                      <div className="space-y-3">
                        <h4 className="font-medium">Claims:</h4>
                        {result.analysis.claims.map((claim, index) => {
                          const icon = claim.accuracy
                            .toLowerCase()
                            .includes("accurate") ? (
                            <CheckCircle className="h-5 w-5 text-green-500" />
                          ) : claim.accuracy
                              .toLowerCase()
                              .includes("inaccurate") ? (
                            <XCircle className="h-5 w-5 text-red-500" />
                          ) : claim.accuracy
                              .toLowerCase()
                              .includes("partially") ? (
                            <AlertTriangle className="h-5 w-5 text-yellow-500" />
                          ) : (
                            <HelpCircle className="h-5 w-5 text-gray-500" />
                          );
                          return (
                            <div
                              key={index}
                              className="border rounded-md p-3 flex gap-2 bg-muted"
                            >
                              {icon}
                              <div>
                                <p className="font-medium">{claim.statement}</p>
                                <Badge variant="outline">
                                  {claim.accuracy}
                                </Badge>
                                <p className="text-sm mt-1 text-muted-foreground">
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
        <Card className="mb-6 bg-gradient-to-r from-blue-600 to-indigo-700 border-0">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-white">
              Nexus of Truth Live Broadcast
            </CardTitle>
            <CardDescription className="text-blue-100">
              Real-time misinformation detection during live broadcasts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4">
              <span className="text-white font-medium">Select Role:</span>
              <Select
                value={role}
                onValueChange={(value) => {
                  setRole(value);
                  if (value === "host") client.setClientRole("host");
                  if (value === "audience") client.setClientRole("audience");
                }}
              >
                <SelectTrigger className="w-[180px] bg-white/10 text-white border-blue-400 focus:ring-blue-300">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="host">Host</SelectItem>
                  <SelectItem value="audience">Audience</SelectItem>
                </SelectContent>
              </Select>
              <Badge
                variant="outline"
                className="bg-blue-500 text-white border-none"
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
        <Card>
          <CardHeader>
            <CardTitle>Join Broadcast</CardTitle>
            <CardDescription>
              Enter the channel name of the broadcast you want to join.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="channel">Channel Name</Label>
                <Input
                  id="channel"
                  onChange={(e) => setChannel(e.target.value)}
                  placeholder="Enter channel name"
                  value={channel}
                />
              </div>
              <Button
                disabled={!appId || !channel}
                onClick={() => setCalling(true)}
                className="w-full"
              >
                Join Channel
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-0 overflow-hidden border-0 bg-gray-900 shadow-xl">
              <div className="relative" style={{ height: "400px" }}>
                <LocalUser
                  audioTrack={localMicrophoneTrack}
                  cameraOn={cameraOn}
                  playAudio={false}
                  micOn={micOn}
                  videoTrack={localCameraTrack}
                  style={{ width: "100%", height: "100%" }}
                >
                  <div className="absolute bottom-3 left-3 bg-black/60 px-3 py-1 rounded-md text-white font-medium flex items-center gap-2">
                    <span>You</span>
                    {!micOn && <MicOff className="h-4 w-4" />}
                    {!cameraOn && <VideoOff className="h-4 w-4" />}
                  </div>
                </LocalUser>
              </div>
            </Card>
            {remoteUsers.map((user) => (
              <Card
                key={user.uid}
                className="p-0 overflow-hidden border-0 bg-gray-900 shadow-xl"
              >
                <div className="relative" style={{ height: "400px" }}>
                  <RemoteUser
                    user={user}
                    style={{ width: "100%", height: "100%" }}
                  >
                    <div className="absolute bottom-3 left-3 bg-black/60 px-3 py-1 rounded-md text-white font-medium">
                      User {user.uid}
                    </div>
                  </RemoteUser>
                </div>
              </Card>
            ))}
          </div>

          <Card>
            <CardContent className="pt-6 flex flex-wrap justify-center gap-4">
              <Button
                onClick={() => setMic((a) => !a)}
                variant={micOn ? "default" : "destructive"}
                className="px-6 rounded-full"
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
                variant={cameraOn ? "default" : "destructive"}
                className="px-6 rounded-full"
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
                className="px-6 rounded-full"
              >
                <PhoneOff className="mr-2 h-4 w-4" /> End Broadcast
              </Button>
            </CardContent>
          </Card>

          <FactCheckModalList results={factCheckResults} />
        </div>
      )}
    </>
  );
};

export default InteractiveLiveStreaming;
