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
  newsObjs : {
    id: string;
    article: string;
    full_text: { 
        status: string,
        summary: string,
        keywords: string,
        title: string,
        text: string,
        url: string
    };
    fact_check: {
      timestamp: number,
      original_text: string,
      detailed_analysis: {
        overall_analysis: {
          truth_score: number,
          reliability_assessment: string,
          key_findings: string[],
          patterns_identified: string[]
        },
        claim_analysis: {
          claim: string,
          verification_status: string,
          confidence_level: number,
          evidence_quality :{
            strength: number,
            gaps: string[],
            contradictions: string[],
          },
          source_assessment: {
            url: string,
            credibility_metrics: {
              credibility_score: number,
              bias_rating: string,
              fact_checking_history: number
            },
            relevance_to_claim: number
          }[],
          misinformation_impact: {
            severity: number,
            affected_domains: string[],
            potential_consequences: string[],
            spread_risk: number,
          },
          correction_suggestions: {
            verified_facts: string[],
            recommended_sources: {
              url: string,
              credibility_score: number,
              relevance: number
            }[],
            context_missing: string[],
          },
        }[],
        meta_analysis: {
          information_ecosystem_impact: string,
          recommended_actors: string[],
          prevention_strategies: string[],
        },
      },
    };
  }[]
}


const RealtimeNews = () => {
  //NewsObject state
  const [news, setNews] = useState<NewsObject>({
    newsObjs: [],
  });
  const api_url = import.meta.env.VITE_NEWS_API_URL;
  
  useEffect(() => {
    const ws = new WebSocket(api_url);

    ws.onopen = () => {
      console.log('Connected to news WebSocket');
    };
    
    ws.onmessage = (event) => {
        const newsData = JSON.parse(event.data);
        setNews(newsData);
        console.log("Got news");
        console.log(newsData);
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    ws.onclose = () => {
      console.log('Disconnected from news WebSocket');
    };

    // Cleanup on component unmount
    return () => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
    };
  }, [])
  
  const dummyNews = [
    {
      id: 1,
      title: "Breaking: Major earthquake hits California",
      content: "A 7.1 magnitude earthquake has struck...",
      url: "https://example.com/news/1",
    },
    {
      id: 2,
      title: "New study shows coffee may extend lifespan",
      content: "Researchers at a leading university have found...",
      url: "https://example.com/news/2",
    },
    {
      id: 3,
      title: "Tech giant announces revolutionary AI breakthrough",
      content: "In a surprise announcement, the CEO revealed...",
      url: "https://example.com/news/3",
    },
    {
      id: 4,
      title: "Global leaders gather for climate change summit",
      content: "Representatives from over 190 countries...",
      url: "https://example.com/news/4",
    },
    {
      id: 5,
      title: "Rare astronomical event visible tonight",
      content: "Stargazers are in for a treat as...",
      url: "https://example.com/news/5",
    },
  ];

  
  const dummyResults = [
    {
      id: 1,
      title: "Earthquake report confirmed by USGS",
      status: "Verified",
      details:
        "The United States Geological Survey has confirmed the occurrence of a 7.1 magnitude earthquake in California. Multiple seismological stations recorded the event, and the epicenter has been precisely located. Local authorities have initiated emergency response protocols.",
    },
    {
      id: 2,
      title: "Coffee study needs further peer review",
      status: "Inconclusive",
      details:
        "While the study shows promising results regarding coffee consumption and longevity, several experts in the field have called for further peer review. The sample size and methodology have been questioned, and replication studies are needed to confirm the findings.",
    },
    {
      id: 3,
      title: "AI claims exaggerated, experts say",
      status: "Misleading",
      details:
        "Independent AI researchers have questioned the claims made by the tech giant. While the announced AI system does show improvements in certain tasks, the term 'revolutionary breakthrough' is considered an overstatement. The system's capabilities are more incremental than revolutionary.",
    },
    {
      id: 4,
      title: "Climate summit attendance verified",
      status: "Verified",
      details:
        "Official records confirm the attendance of representatives from 192 countries at the global climate change summit. The summit's agenda and key discussion points have been corroborated by multiple reliable sources, including official government statements and UN reports.",
    },
    {
      id: 5,
      title: "Astronomical event confirmed by NASA",
      status: "Verified",
      details:
        "NASA's official Twitter account has posted confirmation of the rare astronomical event. Several observatories around the world have also provided data supporting the occurrence. Amateur astronomers have successfully captured images of the event, further verifying its authenticity.",
    },
  ];

  return (
    <div className="space-y-4 mt-10 bg-black text-white">
      <ScrollArea className="w-full whitespace-nowrap rounded-md border border-gray-800">
        <div className="flex w-max space-x-4 p-4">
          {dummyNews.map((news) => (
            <Card
              key={news.id}
              className="w-[300px] shrink-0 bg-gray-900 border-gray-800"
            >
              <CardHeader>
                <CardTitle className="text-sm line-clamp-2 text-white">
                  <a
                    href={news.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline hover:text-blue-400"
                  >
                    {news.title}
                  </a>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-gray-400 line-clamp-3">
                  {news.content}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
        <ScrollBar orientation="horizontal" className="bg-gray-800" />
      </ScrollArea>

      <ScrollArea className="w-full whitespace-nowrap rounded-md border border-gray-800">
        <div className="flex w-max space-x-4 p-4">
          {dummyResults.map((result) => (
            <Dialog key={result.id}>
              <DialogTrigger asChild>
                <Card className="w-[300px] shrink-0 cursor-pointer hover:bg-gray-800 transition-colors bg-gray-900 border-gray-800">
                  <CardHeader>
                    <CardTitle className="text-sm line-clamp-2 text-white">
                      {result.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p
                      className={`text-sm font-semibold mb-2 ${
                        result.status === "Verified"
                          ? "text-emerald-400"
                          : result.status === "Inconclusive"
                          ? "text-amber-400"
                          : "text-rose-400"
                      }`}
                    >
                      {result.status}
                    </p>
                    <p className="text-xs text-gray-400 line-clamp-3">
                      {result.details}
                    </p>
                  </CardContent>
                </Card>
              </DialogTrigger>
              <DialogContent className="bg-gray-900 border-gray-800 text-white">
                <DialogHeader>
                  <DialogTitle className="text-white">
                    {result.title}
                  </DialogTitle>
                </DialogHeader>
                <div className="mt-4">
                  <p
                    className={`text-sm font-semibold mb-2 ${
                      result.status === "Verified"
                        ? "text-emerald-400"
                        : result.status === "Inconclusive"
                        ? "text-amber-400"
                        : "text-rose-400"
                    }`}
                  >
                    {result.status}
                  </p>
                  <p className="text-sm text-gray-400">{result.details}</p>
                </div>
              </DialogContent>
            </Dialog>
          ))}
        </div>
        <ScrollBar orientation="horizontal" className="bg-gray-800" />
      </ScrollArea>
    </div>
  );
};

export default RealtimeNews;
