import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2 } from "lucide-react";

export default function UserInput() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setResult("Analysis complete: This content appears to be reliable.");
      setIsLoading(false);
    }, 2000);
  };

  return (
    <div className="container mx-auto p-8 bg-black text-white min-h-screen">
      <h1 className="text-3xl font-bold mb-8">Content Verification</h1>

      <Tabs defaultValue="text" className="w-full">
        <TabsList className="grid w-full grid-cols-2 gap-8 mb-8 bg-gray-900 p-6 rounded-lg h-auto">
          <TabsTrigger
            value="text"
            className="p-2 bg-gray-800 text-white hover:bg-gray-700 data-[state=active]:bg-blue-600"
          >
            Text Input
          </TabsTrigger>
          <TabsTrigger
            value="url"
            className="p-2 bg-gray-800 text-white hover:bg-gray-700 data-[state=active]:bg-blue-600"
          >
            News URL
          </TabsTrigger>
        </TabsList>

        <form onSubmit={handleSubmit} className="space-y-6">
          <TabsContent value="text">
            <Textarea
              placeholder="Enter the news or text to verify..."
              className="bg-gray-900 border-gray-800 text-white min-h-[200px] resize-none"
            />
          </TabsContent>

          <TabsContent value="url">
            <Input
              placeholder="Enter news article URL..."
              type="url"
              className="bg-gray-900 border-gray-800 text-white"
            />
          </TabsContent>
          <Button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700"
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            Verify Content
          </Button>
        </form>
      </Tabs>

      {(isLoading || result) && (
        <Card className="mt-8 bg-gray-900 border-gray-800">
          <CardContent className="pt-6">
            {isLoading ? (
              <div className="flex items-center justify-center space-x-2">
                <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                <span className="text-gray-400">Analyzing content...</span>
              </div>
            ) : (
              <div className="text-gray-200">{result}</div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
