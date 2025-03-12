import { useState } from 'react';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '../ui/dialog';

type Analysis = {
    fact_check_result: {
        detailed_analysis: {
            overall_analysis: {
                truth_score: number;
                reliability_assessment: string;
                key_findings: string[];
            };
            claim_analysis: Array<{
                claim: string;
                verification_status: string;
                confidence_level: string;
            }>;
        };
    };
    sources?: string[];
}

export default function TextAnalysis() {
    const [inputText, setInputText] = useState('');
    const [analysis, setAnalysis] = useState<Analysis | null>(null);
    const [loading, setLoading] = useState(false);
    const [showSources, setShowSources] = useState(false);

    const analyzeText = async () => {
        if (!inputText.trim()) return;

        setLoading(true);

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/get-fc-text`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    text: inputText
                }),
            });
            const data = await response.json();
            setAnalysis(data.content);
        } catch (error) {
            console.error('Error analyzing text:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex flex-col gap-4">
                <Textarea
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Enter the news or text to verify..."
                    className="bg-gray-900 border-gray-800 text-white min-h-[200px] resize-none"
                />
                <div className="flex justify-center">
                    <Button
                        onClick={analyzeText}
                        disabled={!inputText.trim() || loading}
                        type="submit"
                        className="w-64 bg-blue-600 hover:bg-blue-700 mx-auto"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Analyzing...
                            </>
                        ) : 'Analyze Text'}
                    </Button>
                </div>
            </div>

            {analysis && (
                <div className="mt-4 p-4 bg-gray-800 rounded-lg">
                    <Dialog>
                        <DialogTrigger asChild>
                            <Card className="w-full cursor-pointer hover:bg-gray-800 transition-colors bg-gray-900 border-gray-800">
                                <CardHeader>
                                    <CardTitle className="text-sm text-white">
                                        Analysis Results
                                        (click for detailed analysis)
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-2">
                                        <p className={`text-sm font-semibold ${analysis.fact_check_result.detailed_analysis.overall_analysis.truth_score >= 0.75
                                                ? "text-emerald-400"
                                                : analysis.fact_check_result.detailed_analysis.overall_analysis.truth_score < 0.75
                                                    ? "text-amber-400"
                                                    : "text-rose-400"
                                            }`}>
                                            Truth Score: {analysis.fact_check_result.detailed_analysis.overall_analysis.truth_score}
                                        </p>
                                        <p className="text-sm text-gray-200">
                                            Reliability: {analysis.fact_check_result.detailed_analysis.overall_analysis.reliability_assessment}
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
                                <div>
                                    <h3 className="text-lg font-semibold text-emerald-400 mb-3">Overall Analysis</h3>
                                    <div className="space-y-4 bg-gray-800 p-4 rounded-md">
                                        <p className="text-sm font-semibold">
                                            Truth Score: {analysis.fact_check_result.detailed_analysis.overall_analysis.truth_score}
                                        </p>
                                        <p className="text-sm">
                                            Reliability: {analysis.fact_check_result.detailed_analysis.overall_analysis.reliability_assessment}
                                        </p>
                                        <div>
                                            <p className="text-sm font-medium mb-2">Key Findings:</p>
                                            <ul className="list-disc pl-4 text-sm text-gray-300">
                                                {analysis.fact_check_result.detailed_analysis.overall_analysis.key_findings.map(
                                                    (finding, index) => (
                                                        <li key={index}>{finding}</li>
                                                    )
                                                )}
                                            </ul>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-6">
                                    <button
                                        className="px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600 transition-colors"
                                        onClick={() => setShowSources(!showSources)}
                                    >
                                        {showSources ? 'Hide Sources' : 'Show Sources'}
                                    </button>

                                    {showSources && (
                                        <div className="mt-4 bg-gray-800 p-4 rounded-md">
                                            <h4 className="text-emerald-400 font-medium mb-2">Sources</h4>
                                            <ul className="list-disc pl-4 text-gray-300">
                                                {analysis.sources?.map((url, index) => (
                                                    <li key={index} className="mb-2">
                                                        <a
                                                            href={url}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-blue-400 hover:underline"
                                                        >
                                                            {url}
                                                        </a>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <h3 className="text-lg font-semibold text-emerald-400 mb-3">Claim Analysis</h3>
                                    <div className="space-y-4">
                                        {analysis.fact_check_result.detailed_analysis.claim_analysis.map(
                                            (claim, index) => (
                                                <div key={index} className="bg-gray-800 p-4 rounded-md">
                                                    <p className="font-medium mb-2">{claim.claim}</p>
                                                    <p className={`text-sm ${claim.verification_status === "Verified"
                                                            ? "text-emerald-400"
                                                            : claim.verification_status === "Partially Verified"
                                                                ? "text-amber-400"
                                                                : "text-rose-400"
                                                        }`}>
                                                        Status: {claim.verification_status} (Confidence: {claim.confidence_level})
                                                    </p>
                                                </div>
                                            )
                                        )}
                                    </div>
                                </div>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>
            )}
        </div>
    );
}
