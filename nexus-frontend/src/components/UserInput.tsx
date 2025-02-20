import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { UserInputObject, UserInputOutput } from "./types";

export default function UserInput() {
  const [isLoading, setIsLoading] = useState(false);
  const [inputType, setInputType] = useState("text");
  const [inputValue, setInputValue] = useState("");
  const api_url = import.meta.env.VITE_API_URL;
  const [result, setResult] = useState<UserInputObject | null>(null);

  const updateMyStatePlease = (withWhat: UserInputObject) => {
    setResult(withWhat);
  };
  useEffect(() => {
    console.log("Result updated:", result);
  }, [result]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    const endpoint = inputType === "url" ? "get-fc-url" : "get-fc-text";

    try {
      const response = await fetch(`${api_url}/${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          [inputType]: inputValue,
        }),
      });

      const data: UserInputOutput = await response.json();

      const res: UserInputObject = data.content;
      console.log(res);

      console.log("Result before set: " + result);
      setResult((prevResult) => {
        if (prevResult) {
          console.log("Result before update: " + prevResult);
        }
        console.log("Result after update: " + res);
        return res;
      });

      console.log("Result: " + result);
    } catch (error) {
      // Handle error
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };
  console.log("Result outside: " + result);
  if (!result && isLoading) {
    return <div>LOADING HOGA SHAYAD</div>;
  }

  return (
    <div className="container mx-auto p-8 bg-black text-white min-h-screen">
      <h1 className="text-3xl font-bold mb-8">Content Verification</h1>

      <Tabs defaultValue="text" className="w-full">
        <TabsList className="grid w-full grid-cols-2 gap-8 mb-8 bg-gray-900 p-6 rounded-lg h-auto">
          <TabsTrigger
            value="text"
            onClick={() => {
              setInputType("text");
              setInputValue("");
            }}
            className="p-2 bg-gray-800 text-white hover:bg-gray-700 data-[state=active]:bg-blue-600"
          >
            Text Input
          </TabsTrigger>
          <TabsTrigger
            value="url"
            onClick={() => {
              setInputType("url");
              setInputValue("");
            }}
            className="p-2 bg-gray-800 text-white hover:bg-gray-700 data-[state=active]:bg-blue-600"
          >
            News URL
          </TabsTrigger>
        </TabsList>

        <form onSubmit={handleSubmit} className="space-y-6">
          <TabsContent value="text">
            <Textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Enter the news or text to verify..."
              className="bg-gray-900 border-gray-800 text-white min-h-[200px] resize-none"
            />
          </TabsContent>

          <TabsContent value="url">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Enter news article URL..."
              type="url"
              className="bg-gray-900 border-gray-800 text-white"
            />
          </TabsContent>
          <div className="flex justify-center">
            <Button
              type="submit"
              className="w-64 bg-blue-600 hover:bg-blue-700 mx-auto"
              disabled={isLoading}
              >
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              Verify Content
            </Button>
          </div>
        </form>
      </Tabs>

      {/* Replace the existing result display with this: */}
      {(isLoading || result) && (
          <CardContent className="pt-6">
            {isLoading ? (
              <div className="flex items-center justify-center space-x-2">
                <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                <span className="text-gray-400">Analyzing content...</span>
              </div>
            ) : (
              <Dialog>
                <DialogTrigger asChild>
                  <Card className="w-full cursor-pointer hover:bg-gray-800 transition-colors bg-gray-900 border-gray-800">
                    <CardHeader>
                      <CardTitle className="text-sm text-white">
                        Analysis Results
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <p
                          className={`text-sm font-semibold mb-2 ${
                            result &&
                            (result.fact_check_result.detailed_analysis.overall_analysis
                              .truth_score >= 0.75
                              ? "text-emerald-400"
                              : result?.fact_check_result.detailed_analysis.overall_analysis
                                  .truth_score < 0.75
                              ? "text-amber-400"
                              : "text-rose-400")
                          }`}
                        >
                          Truth Score:{" "}
                          {
                            result?.fact_check_result.detailed_analysis.overall_analysis
                              .truth_score
                          }
                        </p>
                        <p className="text-sm text-gray-200">
                          Reliability:{" "}
                          {
                            result?.fact_check_result.detailed_analysis.overall_analysis
                              .reliability_assessment
                          }
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </DialogTrigger>

                <DialogContent className="bg-gray-900 border-gray-800 text-white max-w-4xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="text-xl font-bold text-blue-400 border-b border-gray-700 pb-2">
                      Detailed Analysis Results
                    </DialogTitle>
                  </DialogHeader>

                  <div className="space-y-6 mt-4">
                    {/* Overall Analysis Section */}
                    <div>
                      <h3 className="text-lg font-semibold text-emerald-400 mb-3">
                        Overall Analysis
                      </h3>
                      <div className="space-y-4 bg-gray-800 p-4 rounded-md">
                        <p className="text-sm font-semibold">
                          Truth Score:{" "}
                          {
                            result?.fact_check_result.detailed_analysis.overall_analysis
                              .truth_score
                          }
                        </p>
                        <p className="text-sm">
                          Reliability:{" "}
                          {
                            result?.fact_check_result.detailed_analysis.overall_analysis
                              .reliability_assessment
                          }
                        </p>

                        <div>
                          <p className="text-sm font-medium mb-2">
                            Key Findings:
                          </p>
                          <ul className="list-disc pl-4 text-sm text-gray-300">
                            {result?.fact_check_result.detailed_analysis.overall_analysis.key_findings.map(
                              (finding, index) => (
                                <li key={index}>{finding}</li>
                              )
                            )}
                          </ul>
                        </div>

                        <div>
                          <p className="text-sm font-medium mb-2">
                            Patterns Identified:
                          </p>
                          <ul className="list-disc pl-4 text-sm text-gray-300">
                            {result?.fact_check_result.detailed_analysis.overall_analysis.patterns_identified.map(
                              (pattern, index) => (
                                <li key={index}>{pattern}</li>
                              )
                            )}
                          </ul>
                        </div>
                      </div>
                    </div>

                    {/* Claim Analysis Section */}
                    <div>
                      <h3 className="text-lg font-semibold text-emerald-400 mb-3">
                        Claim Analysis
                      </h3>
                      <div className="space-y-4">
                        {result?.fact_check_result.detailed_analysis.claim_analysis.map(
                          (claim, index) => (
                            <div
                              key={index}
                              className="bg-gray-800 p-4 rounded-md"
                            >
                              <p className="font-medium mb-2">{claim.claim}</p>
                              <p
                                className={`text-sm ${
                                  claim.verification_status === "Verified"
                                    ? "text-emerald-400"
                                    : claim.verification_status ===
                                      "Partially Verified"
                                    ? "text-amber-400"
                                    : "text-rose-400"
                                }`}
                              >
                                Status: {claim.verification_status} (Confidence:{" "}
                                {claim.confidence_level})
                              </p>

                              <div className="mt-4">
                                <p className="text-sm font-medium mb-2">
                                  Evidence Quality:
                                </p>
                                <p className="text-sm">
                                  Strength: {claim.evidence_quality.strength}
                                </p>
                                <ul className="list-disc pl-4 text-sm text-gray-300 mt-2">
                                  {claim.evidence_quality.gaps.map((gap, i) => (
                                    <li key={i}>{gap}</li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    </div>

                    {/* Explanation Section */}
                    <div>
                      <h3 className="text-lg font-semibold text-emerald-400 mb-3">
                        Explanation
                      </h3>
                      <div className="bg-gray-800 p-4 rounded-md">
                        <p className="text-sm mb-4">
                          {result?.explanation.explanation_summary}
                        </p>

                        <div className="space-y-4">
                          {result?.explanation.claim_explanations.map(
                            (exp, index) => (
                              <div
                                key={index}
                                className="border-t border-gray-700 pt-4"
                              >
                                <p className="font-medium mb-2">{exp.claim}</p>
                                <p className="text-sm text-gray-300">
                                  {exp.reasoning}
                                </p>
                                <ul className="list-disc pl-4 text-sm text-gray-300 mt-2">
                                  {exp.key_factors.map((factor, i) => (
                                    <li key={i}>{factor}</li>
                                  ))}
                                </ul>
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </CardContent>
      )}
    </div>
  );
}
