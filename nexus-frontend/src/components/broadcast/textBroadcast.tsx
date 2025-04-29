import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Loader2,
  Send,
  FileText,
  AlertTriangle,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import PusherClient from "pusher-js";
import { motion, AnimatePresence } from "framer-motion";

const pusherClient = new PusherClient(import.meta.env.VITE_PUSHER_KEY!, {
  cluster: "ap2",
});

interface BroadcastObject {
  id: string;
  title: string;
  text: string;
  user_name: string;
  factcheck: {
    detailed_analysis: {
      overall_analysis: {
        truth_score: number;
        reliability_assessment: string;
        key_findings: string[];
      };
      claim_analysis: {
        claim: string;
        verification_status: string;
        confidence_level: number;
        misinformation_impact: {
          severity: number;
          affected_domains: string[];
          potential_consequences: string[];
          spread_risk: number;
        };
      }[];
      original_text: string;
      timestamp: string;
    };
  };
}

export default function TextBroadcast() {
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [name, setName] = useState("");
  const [broadcasts, setBroadcasts] = useState<BroadcastObject[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [broadcastLoading, setBroadcastLoading] = useState(true);
  const [selectedClaims, setSelectedClaims] = useState<any>(null);
  const [showClaimsDialog, setShowClaimsDialog] = useState(false);
  const api_url = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchBroadcasts = async () => {
      try {
        const response = await fetch(`${api_url}/user-broadcasts`);
        const data = await response.json();
        console.log("Received broadcasts:", data);
        setBroadcasts(data.content);
        setBroadcastLoading(false);
      } catch (error) {
        console.error("Error fetching broadcasts:", error);
      }
    };

    fetchBroadcasts();

    pusherClient.subscribe("user-channel");
    pusherClient.bind("new-broadcast", (data: BroadcastObject) => {
      setBroadcasts((prev) => [data, ...prev]);
    });

    return () => {
      pusherClient.unsubscribe("user-channel");
    };
  }, [api_url]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!title.trim() || !text.trim() || !name.trim()) {
      return; // Don't submit if any field is empty
    }

    setIsLoading(true);

    try {
      await fetch(`${api_url}/user-broadcast`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, text, name }),
      });

      setTitle("");
      setText("");
      setName("");
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getTruthScoreColor = (score: number) => {
    if (score >= 0.75) return "text-emerald-400";
    if (score >= 0.5) return "text-amber-400";
    return "text-rose-400";
  };

  const getVerificationStatusColor = (status: string) => {
    if (status === "Verified") return "text-emerald-400";
    if (status === "Partially Verified") return "text-amber-400";
    return "text-rose-400";
  };

  const getVerificationIcon = (status: string) => {
    if (status === "Verified")
      return <CheckCircle className="w-4 h-4 text-emerald-400" />;
    if (status === "Partially Verified")
      return <AlertCircle className="w-4 h-4 text-amber-400" />;
    return <AlertTriangle className="w-4 h-4 text-rose-400" />;
  };

  return (
    <div className="flex flex-col md:flex-row gap-6">
      <motion.div
        className="md:w-1/3 w-full"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <form
          onSubmit={handleSubmit}
          className="space-y-6 bg-gradient-to-br from-gray-900 to-gray-800 p-6 rounded-xl border border-gray-700 shadow-xl"
        >
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-400" />
            Create Broadcast
          </h2>
          <div className="space-y-2">
            <label
              htmlFor="author-name"
              className="text-sm font-medium text-gray-300"
            >
              Author Name
            </label>
            <Input
              id="author-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name..."
              className="bg-gray-800 text-white border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
            />
          </div>
          <div className="space-y-2">
            <label
              htmlFor="news-title"
              className="text-sm font-medium text-gray-300"
            >
              News Title
            </label>
            <Input
              id="news-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter news title..."
              className="bg-gray-800 text-white border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
            />
          </div>
          <div className="space-y-2">
            <label
              htmlFor="news-content"
              className="text-sm font-medium text-gray-300"
            >
              News Content
            </label>
            <Textarea
              id="news-content"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Enter news content..."
              className="bg-gray-800 text-white border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 min-h-[200px] transition-all"
            />
          </div>
          <Button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
            disabled={
              isLoading || !title.trim() || !text.trim() || !name.trim()
            }
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <Send className="h-4 w-4" />
                Broadcast
              </>
            )}
          </Button>
        </form>
      </motion.div>

      <motion.div
        className="md:w-2/3 w-full"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="bg-gray-900 p-4 rounded-xl border border-gray-800 h-[calc(100vh-8rem)]">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-400" />
            Recent Broadcasts
          </h2>

          {broadcastLoading ? (
            <div className="flex items-center justify-center h-[calc(100vh-12rem)]">
              <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            </div>
          ) : broadcasts.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-[calc(100vh-12rem)] text-gray-400">
              <FileText className="h-16 w-16 mb-4 opacity-20" />
              <p className="text-lg">No broadcasts yet</p>
              <p className="text-sm">Be the first to create a broadcast!</p>
            </div>
          ) : (
            <ScrollArea className="h-[calc(100vh-12rem)] pr-4">
              <AnimatePresence>
                <div className="space-y-4">
                  {broadcasts.map((broadcast, index) => (
                    <motion.div
                      key={broadcast.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05, duration: 0.3 }}
                    >
                      <Dialog>
                        <DialogTrigger asChild>
                          <Card className="cursor-pointer hover:bg-gray-800/70 transition-all duration-200 bg-gray-900 border-gray-800 hover:border-gray-700 hover:shadow-lg">
                            <CardHeader className="pb-2">
                              <CardTitle className="text-white">
                                <div className="text-sm text-blue-400 mb-1">
                                  {broadcast.user_name}
                                </div>
                                <div className="text-lg">{broadcast.title}</div>
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              <p className="text-gray-300 line-clamp-2">
                                {broadcast.text}
                              </p>
                            </CardContent>
                          </Card>
                        </DialogTrigger>

                        <DialogContent className="bg-gray-900 border-gray-800 text-white max-w-2xl">
                          <DialogHeader>
                            <DialogTitle className="text-xl font-bold text-blue-400">
                              {broadcast.title}
                            </DialogTitle>
                            <div className="text-sm text-blue-400 mt-2">
                              By {broadcast.user_name}
                            </div>
                          </DialogHeader>

                          <ScrollArea className="max-h-[60vh] pr-4">
                            <div className="mt-4 space-y-6">
                              <div className="text-gray-200 whitespace-pre-line">
                                {broadcast.text}
                              </div>

                              <Button
                                onClick={() => {
                                  setSelectedClaims(broadcast);
                                  setShowClaimsDialog(true);
                                }}
                                className="bg-blue-600 hover:bg-blue-700 transition-colors flex items-center gap-2"
                              >
                                <CheckCircle className="h-4 w-4" />
                                View Fact Check Results
                              </Button>
                            </div>
                          </ScrollArea>
                        </DialogContent>
                      </Dialog>
                    </motion.div>
                  ))}
                </div>
              </AnimatePresence>
              <ScrollBar />
            </ScrollArea>
          )}
        </div>
      </motion.div>

      <Dialog open={showClaimsDialog} onOpenChange={setShowClaimsDialog}>
        <DialogContent className="bg-gray-900 border-gray-800 text-white max-w-3xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-blue-400 flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              Fact Check Analysis
            </DialogTitle>
          </DialogHeader>

          {selectedClaims && (
            <ScrollArea className="max-h-[70vh] pr-4">
              <div className="space-y-6">
                {/* Truth Score Card */}
                <motion.div
                  className="bg-gray-800/80 rounded-xl p-5 border border-gray-700"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-white">
                      Overall Analysis
                    </h3>
                    <div
                      className={`text-lg font-bold ${getTruthScoreColor(
                        selectedClaims.factcheck.detailed_analysis
                          .overall_analysis.truth_score
                      )}`}
                    >
                      Truth Score:{" "}
                      {selectedClaims.factcheck.detailed_analysis.overall_analysis.truth_score.toFixed(
                        2
                      )}
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="h-3 w-full bg-gray-700 rounded-full overflow-hidden">
                      <motion.div
                        className={`h-full ${
                          selectedClaims.factcheck.detailed_analysis
                            .overall_analysis.truth_score >= 0.75
                            ? "bg-emerald-500"
                            : selectedClaims.factcheck.detailed_analysis
                                .overall_analysis.truth_score >= 0.5
                            ? "bg-amber-500"
                            : "bg-rose-500"
                        }`}
                        initial={{ width: "0%" }}
                        animate={{
                          width: `${
                            selectedClaims.factcheck.detailed_analysis
                              .overall_analysis.truth_score * 100
                          }%`,
                        }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                      />
                    </div>
                  </div>

                  <p className="text-gray-200 mb-4">
                    <span className="font-medium">Reliability: </span>
                    {
                      selectedClaims.factcheck.detailed_analysis
                        .overall_analysis.reliability_assessment
                    }
                  </p>

                  <div>
                    <h4 className="text-white font-medium mb-2">
                      Key Findings:
                    </h4>
                    <ul className="space-y-2">
                      {selectedClaims.factcheck.detailed_analysis.overall_analysis.key_findings.map(
                        (finding: string, index: number) => (
                          <motion.li
                            key={index}
                            className="flex items-start gap-2 text-gray-300"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                          >
                            <div className="mt-1 min-w-[16px]">•</div>
                            <div>{finding}</div>
                          </motion.li>
                        )
                      )}
                    </ul>
                  </div>
                </motion.div>

                {/* Claim Analysis */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-blue-400">
                    Claim Analysis
                  </h3>

                  {selectedClaims.factcheck.detailed_analysis.claim_analysis.map(
                    (claim: any, index: number) => (
                      <motion.div
                        key={index}
                        className="bg-gray-800/80 p-5 rounded-xl border border-gray-700"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 + index * 0.1 }}
                      >
                        <div className="mb-3">
                          <div className="flex items-center gap-2 mb-2">
                            {getVerificationIcon(claim.verification_status)}
                            <h4 className="font-medium text-white text-lg">
                              Claim {index + 1}
                            </h4>
                          </div>
                          <p className="text-white text-base border-l-2 border-gray-600 pl-3 py-1">
                            {claim.claim}
                          </p>
                        </div>

                        <div className="flex items-center gap-4 mb-4">
                          <div
                            className={`text-sm font-medium ${getVerificationStatusColor(
                              claim.verification_status
                            )}`}
                          >
                            {claim.verification_status}
                          </div>
                          <div className="text-sm text-gray-300">
                            Confidence: {claim.confidence_level.toFixed(2)}
                          </div>
                        </div>

                        <div className="bg-gray-900/50 rounded-lg p-4 mt-4">
                          <h5 className="text-blue-400 font-medium mb-3">
                            Misinformation Impact
                          </h5>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div className="bg-gray-800/50 p-3 rounded-lg">
                              <div className="text-sm text-gray-400 mb-1">
                                Severity
                              </div>
                              <div className="flex items-center gap-2">
                                <div className="h-2 flex-grow bg-gray-700 rounded-full overflow-hidden">
                                  <div
                                    className={`h-full ${
                                      claim.misinformation_impact.severity >= 7
                                        ? "bg-rose-500"
                                        : claim.misinformation_impact
                                            .severity >= 4
                                        ? "bg-amber-500"
                                        : "bg-emerald-500"
                                    }`}
                                    style={{
                                      width: `${
                                        (claim.misinformation_impact.severity /
                                          10) *
                                        100
                                      }%`,
                                    }}
                                  />
                                </div>
                                <div className="text-white font-medium">
                                  {claim.misinformation_impact.severity}/10
                                </div>
                              </div>
                            </div>

                            <div className="bg-gray-800/50 p-3 rounded-lg">
                              <div className="text-sm text-gray-400 mb-1">
                                Spread Risk
                              </div>
                              <div className="flex items-center gap-2">
                                <div className="h-2 flex-grow bg-gray-700 rounded-full overflow-hidden">
                                  <div
                                    className={`h-full ${
                                      claim.misinformation_impact.spread_risk >=
                                      7
                                        ? "bg-rose-500"
                                        : claim.misinformation_impact
                                            .spread_risk >= 4
                                        ? "bg-amber-500"
                                        : "bg-emerald-500"
                                    }`}
                                    style={{
                                      width: `${
                                        (claim.misinformation_impact
                                          .spread_risk /
                                          10) *
                                        100
                                      }%`,
                                    }}
                                  />
                                </div>
                                <div className="text-white font-medium">
                                  {claim.misinformation_impact.spread_risk}/10
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="mt-4">
                            <h6 className="text-gray-300 font-medium mb-2">
                              Potential Consequences:
                            </h6>
                            <ul className="space-y-1">
                              {claim.misinformation_impact.potential_consequences.map(
                                (consequence: string, i: number) => (
                                  <motion.li
                                    key={i}
                                    className="flex items-start gap-2 text-gray-400"
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                  >
                                    <div className="mt-1 min-w-[16px]">•</div>
                                    <div>{consequence}</div>
                                  </motion.li>
                                )
                              )}
                            </ul>
                          </div>

                          {claim.misinformation_impact.affected_domains &&
                            claim.misinformation_impact.affected_domains
                              .length > 0 && (
                              <div className="mt-4">
                                <h6 className="text-gray-300 font-medium mb-2">
                                  Affected Domains:
                                </h6>
                                <div className="flex flex-wrap gap-2">
                                  {claim.misinformation_impact.affected_domains.map(
                                    (domain: string, i: number) => (
                                      <span
                                        key={i}
                                        className="px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded-full"
                                      >
                                        {domain}
                                      </span>
                                    )
                                  )}
                                </div>
                              </div>
                            )}
                        </div>
                      </motion.div>
                    )
                  )}
                </div>

                {/* Timestamp */}
                <div className="text-center text-gray-500 text-sm mt-6">
                  Analysis performed on:{" "}
                  {new Date(
                    selectedClaims.factcheck.detailed_analysis.timestamp ||
                      Date.now()
                  ).toLocaleString()}
                </div>
              </div>
            </ScrollArea>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
