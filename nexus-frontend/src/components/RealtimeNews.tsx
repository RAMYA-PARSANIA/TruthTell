import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

//Interface for news object
interface NewsObject {
    id: string;
    article: string;
    full_text: { 
        status: string,
        summary: string,
        title: string,
        text?: string,
        url: string
    };
    fact_check: {
      detailed_analysis: {
        overall_analysis: {
          truth_score: number,
          reliability_assessment: string,
          key_findings: string[]
        },
        claim_analysis: {
          claim: string,
          verification_status: string,
          confidence_level: number,
          misinformation_impact: {
            severity: number,
            affected_domains: string[],
            potential_consequences: string[],
            spread_risk: number
          }
        }[]
      },
    };
    sources: string[];
}

import PusherClient from "pusher-js";

// Allows you to use Pusher inside Next.js "use client" components.
export const pusherClient = new PusherClient(
  import.meta.env.VITE_PUSHER_KEY!,
  {
    cluster: "ap2",
  }
);


const RealtimeNews = () => {
  //NewsObject state
  const [news, setNews] = useState<NewsObject[]>([]);
  const [selectedClaims, setSelectedClaims] = useState<any>(null);
  const [showClaimsDialog, setShowClaimsDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showSources, setShowSources] = useState(false);
  const api_url = import.meta.env.VITE_API_URL;
  
  useEffect(() => {
    const fetchInitialNews = async () => {
      try {
        const response = await fetch(`${api_url}/all-news`);
        const data = await response.json();
        setNews([...data.content]);
        console.log("Initial news fetched:", data);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching initial news:', error);
      }
    };


    fetchInitialNews();
  }, []);

  useEffect(() => {
    pusherClient.subscribe("news-channel");
    pusherClient.bind("fact-check", (data: any) => {
      console.log("Received news update:", data);
      setNews((prevNews) => { 
        const newsUpdated = [...prevNews, data];
        return newsUpdated;
      });
      setIsLoading(false);
      console.log("Received news update:", news);
    });
    

    return () => {
      pusherClient.unsubscribe("news-channel");
    };
  }, [])


  
  return (
    <div className="space-y-4 mt-10 bg-black text-white">
      <div className="flex flex-col items-center justify-center min-h-[200px] space-y-4">
        <div className="flex items-center space-x-1">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="w-2 h-8 bg-blue-400 rounded-full animate-wave"
              style={{
                animation: `wave 1s ease-in-out infinite`,
                animationDelay: `${i * 0.1}s`
              }}
            />
          ))}
        </div>
        <span className="text-blue-400 font-medium">Fetching Latest News...</span>
      </div>
      
  
      {!isLoading && (
        <>
          <ScrollArea className="w-full whitespace-nowrap rounded-md border border-gray-800">
            <div className="flex w-max space-x-4 p-4">
              {news.map((newsItems) => (
                <Dialog key={newsItems.id}>
                  <DialogTrigger asChild>
                    <Card
                      className="w-[300px] shrink-0 bg-gray-900 border-gray-800 cursor-pointer hover:bg-gray-800 transition-colors"
                    >
                      <CardHeader className="h-auto">
                        <CardTitle className="text-sm text-white break-words whitespace-normal">
                          <span className="hover:text-blue-400">
                            {newsItems.full_text.title}
                          </span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <a 
                          href={newsItems.full_text.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:underline"
                        >
                          Original Article
                        </a>
                      </CardContent>
                    </Card>
                  </DialogTrigger>
                  <DialogContent className="bg-gray-900 border-gray-800 text-white max-w-2xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle className="text-xl font-bold text-blue-400 border-b border-gray-700 pb-2">
                        {newsItems.full_text.title}
                      </DialogTitle>
                      <h3 className="text-lg font-semibold text-emerald-400 mb-3">Source</h3>
                      <a 
                        href={newsItems.full_text.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:underline"
                      >
                        Original Article
                      </a>
                      <div className="mt-4 space-y-6">
                        <div className="text-sm text-gray-200">
                          <h3 className="text-lg font-semibold text-emerald-400 mb-3">Summary</h3>
                          <p>{newsItems.full_text.summary}</p>
                        </div>
                      </div>
                      {newsItems.full_text.text && (<div className="text-sm text-gray-200">
                        <div className="text-sm text-gray-200">
                          <h3 className="text-lg font-semibold text-emerald-400 mb-3">Full Article</h3>
                          <p className="whitespace-pre-wrap">{newsItems.full_text.text}</p>
                        </div>
                      </div>)}
                    </DialogHeader>
                  </DialogContent>
                </Dialog>
              ))}
            </div>
            <ScrollBar orientation="horizontal" className="bg-gray-800" />
          </ScrollArea>
  
          <ScrollArea className="w-full whitespace-nowrap rounded-md border border-gray-800">
            <div className="flex w-max space-x-4 p-4">
              {news.map((newsItems) => (
                <Dialog key={newsItems.id}>
                  <DialogTrigger asChild>
                    <Card className="w-[300px] shrink-0 cursor-pointer hover:bg-gray-800 transition-colors bg-gray-900 border-gray-800">
                      <CardHeader>
                        <CardTitle className="text-sm line-clamp-2 text-white">
                          {newsItems.full_text.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2 max-h-[200px] overflow-y-auto">
                          <p
                            className={`text-sm font-semibold mb-2 ${
                              newsItems.fact_check.detailed_analysis.overall_analysis.truth_score >= 0.75
                                ? "text-emerald-400"
                                : newsItems.fact_check.detailed_analysis.overall_analysis.truth_score < 0.75
                                ? "text-amber-400"
                                : "text-rose-400"
                            }`}
                          >
                            Truth Score: {newsItems.fact_check.detailed_analysis.overall_analysis.truth_score}
                          </p>
                          <p className="text-sm text-gray-200 line-clamp-1">
                            Reliability: {newsItems.fact_check.detailed_analysis.overall_analysis.reliability_assessment}
                          </p>
                          <div className="mt-2">
                            <p className="text-sm font-medium text-gray-200">Key Findings:</p>
                            <ul className="list-disc pl-4 text-xs text-gray-400">
                              {newsItems.fact_check.detailed_analysis.overall_analysis.key_findings.slice(0, 2).map((finding, index) => (
                                <li key={index} className="line-clamp-1">{finding}</li>
                              ))}
                            </ul>
                          </div>
                          {/* <div className="mt-2">
                            <p className="text-sm font-medium text-gray-200">Patterns:</p>
                            <ul className="list-disc pl-4 text-xs text-gray-400">
                              {newsItems.fact_check.detailed_analysis.overall_analysis.patterns_identified.slice(0, 2).map((pattern, index) => (
                                <li key={index} className="line-clamp-1">{pattern}</li>
                              ))}
                            </ul>
                          </div> */}
                        </div>
                      </CardContent>
                    </Card>
                  </DialogTrigger>
                  <DialogContent className="bg-gray-900 border-gray-800 text-white max-w-2xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle className="text-xl font-bold text-blue-400 border-b border-gray-700 pb-2">
                        {newsItems.full_text.title}
                      </DialogTitle>
                    </DialogHeader>
                    <div className="mt-4">
                      <div className="space-y-2">
                        <p
                          className={`text-sm font-semibold mb-2 ${
                            newsItems.fact_check.detailed_analysis.overall_analysis.truth_score >= 0.75
                              ? "text-emerald-400"
                              : newsItems.fact_check.detailed_analysis.overall_analysis.truth_score < 0.75
                              ? "text-amber-400"
                              : "text-rose-400"
                          }`}
                        >
                          Truth Score: {newsItems.fact_check.detailed_analysis.overall_analysis.truth_score}
                        </p>
                        <p className="text-sm text-gray-200">
                          Reliability: {newsItems.fact_check.detailed_analysis.overall_analysis.reliability_assessment}
                        </p>
                        <div className="mt-2">
                          <p className="text-sm font-medium text-gray-200">Key Findings:</p>
                          <ul className="list-disc pl-4 text-xs text-gray-400">
                            {newsItems.fact_check.detailed_analysis.overall_analysis.key_findings.map((finding, index) => (
                              <li key={index}>{finding}</li>
                            ))}
                          </ul>
                        </div>
                        {/* <div className="mt-2">
                          <p className="text-sm font-medium text-gray-200">Patterns Identified:</p>
                          <ul className="list-disc pl-4 text-xs text-gray-400">
                            {newsItems.fact_check.detailed_analysis.overall_analysis.patterns_identified.map((pattern, index) => (
                              <li key={index}>{pattern}</li>
                            ))}
                          </ul>
                        </div> */}
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
                              {newsItems.sources?.map((url, index) => (
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


                      <div className="mt-6">
                        <button 
                          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                          onClick={() => {
                            setSelectedClaims(newsItems.fact_check.detailed_analysis.claim_analysis);
                            setShowClaimsDialog(true);
                          }}
                        >
                          View Detailed Claim Analysis
                        </button>
                      </div>

                    </div>
                  </DialogContent>
                </Dialog>
              ))}
            </div>
            <ScrollBar orientation="horizontal" className="bg-gray-800" />
          </ScrollArea>
  
          <Dialog open={showClaimsDialog} onOpenChange={setShowClaimsDialog}>
            <DialogContent className="bg-gray-900 border-gray-800 text-white">
              <DialogHeader>
                <DialogTitle className="text-lg font-bold text-blue-400">
                  Claim Analysis
                </DialogTitle>
              </DialogHeader>
              <div className="mt-4">
                <ul className="space-y-4">
                  {selectedClaims?.map((claim: any, index: number) => (
                    <li key={index}>
                      <Dialog>
                        <DialogTrigger asChild>
                          <button className="w-full text-left p-3 bg-gray-800 rounded-md hover:bg-gray-700 transition-colors">
                            <p className="font-medium text-white">{claim.claim}</p>
                            <p className={`text-sm mt-1 ${
                              claim.verification_status === "Verified" 
                                ? "text-emerald-400" 
                                : claim.verification_status === "Partially Verified" 
                                ? "text-amber-400" 
                                : "text-rose-400"
                            }`}>
                              {claim.verification_status} - Confidence: {claim.confidence_level}
                            </p>
                          </button>
                        </DialogTrigger>
                        <DialogContent className="bg-gray-900 border-gray-800 text-white">
                          <DialogHeader>
                            <DialogTitle className="text-blue-400">Detailed Claim Analysis</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            {/* <div>
                              <h4 className="text-emerald-400 font-medium mb-2">Evidence Quality</h4>
                              <p className="text-gray-200">Strength: {claim.evidence_quality.strength}</p>
                              <div className="mt-2">
                                <p className="text-gray-400">Gaps:</p>
                                <ul className="list-disc pl-4 text-gray-300">
                                  {claim.evidence_quality.gaps.map((gap: string, i: number) => (
                                    <li key={i}>{gap}</li>
                                  ))}
                                </ul>
                              </div>
                            </div> */}
                            {/* <div>
                              <h4 className="text-emerald-400 font-medium mb-2">Source Assessment</h4>
                              <ul className="space-y-2">
                                {claim.source_assessment.map((source: any, i: number) => (
                                  <li key={i} className="bg-gray-800 p-2 rounded">
                                    <a href={source.url} className="text-blue-400 hover:underline">{source.url}</a>
                                    <p className="text-sm text-gray-300">Credibility: {source.credibility_metrics.credibility_score}</p>
                                    <p className="text-sm text-gray-300">Bias: {source.credibility_metrics.bias_rating}</p>
                                  </li>
                                ))}
                              </ul>
                            </div> */}
                            <div>
                              <h4 className="text-emerald-400 font-medium mb-2">Misinformation Impact</h4>
                              <p className="text-gray-200">Severity: {claim.misinformation_impact.severity}</p>
                              <p className="text-gray-200">Spread Risk: {claim.misinformation_impact.spread_risk}</p>
                              <div className="mt-2">
                                <p className="text-gray-400">Potential Consequences:</p>
                                <ul className="list-disc pl-4 text-gray-300">
                                  {claim.misinformation_impact.potential_consequences.map((consequence: string, i: number) => (
                                    <li key={i}>{consequence}</li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </li>
                  ))}
                </ul>
              </div>
            </DialogContent>
          </Dialog>
        </>
      )}
    </div>
  );    
};

export default RealtimeNews;