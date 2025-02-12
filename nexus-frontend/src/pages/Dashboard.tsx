import RealtimeNews from "@/components/RealtimeNews";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UserInput from "@/components/UserInput";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto p-8">
        <h1 className="text-3xl font-bold mb-8 text-white">
          Nexus of Truth Dashboard
        </h1>
        <Tabs defaultValue="realtime-news" className="w-full">
          <TabsList className="grid w-full grid-cols-3 gap-4 mb-8 rounded-lg h-auto bg-slate-800">
            <TabsTrigger
              value="realtime-news"
              className="p-3 bg-gray-800 text-white hover:bg-gray-700 data-[state=active]:bg-blue-600"
            >
              Realtime News Checking
            </TabsTrigger>
            <TabsTrigger
              value="deepfake-detection"
              className="p-3 bg-gray-800 text-white hover:bg-gray-700 data-[state=active]:bg-blue-600"
            >
              Deepfake Detection
            </TabsTrigger>
            <TabsTrigger
              value="user-based"
              className="p-3 bg-gray-800 text-white hover:bg-gray-700 data-[state=active]:bg-blue-600"
            >
              User Reports
            </TabsTrigger>
          </TabsList>

          <div className="mt-4">
            <TabsContent value="realtime-news">
              <RealtimeNews />
            </TabsContent>
            <TabsContent value="deepfake-detection">
              <div className="text-gray-400">
                Deepfake detection module coming soon
              </div>
            </TabsContent>
            <TabsContent value="user-based">
              <div className="text-gray-400">
                <UserInput />
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
}
