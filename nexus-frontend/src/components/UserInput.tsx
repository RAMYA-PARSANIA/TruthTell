import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2 } from "lucide-react";

export default function UserInput() {
  const [isLoading, setIsLoading] = useState(false);
  const [inputType, setInputType] = useState("text");
  const [inputValue, setInputValue] = useState("");
  const api_url = import.meta.env.VITE_API_URL;
  const [result, setResult] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    
    const endpoint = inputType === "url" ? "get-fc-url" : "get-fc-text";
    
    try {
      const response = await fetch(`${api_url}/${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          [inputType]: inputValue
        }),
      });
  
      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult("Error analyzing content. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  

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

      {(isLoading || result) && (
          <CardContent className="pt-6">
            {isLoading ? (
              <div className="flex items-center justify-center space-x-2">
                <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                <span className="text-gray-400">Analyzing content...</span>
              </div>
            ) : (
              <div className="text-gray-200 flex items-center justify-center">{result}</div>
            )}
          </CardContent>
      )}
    </div>
  );
}
