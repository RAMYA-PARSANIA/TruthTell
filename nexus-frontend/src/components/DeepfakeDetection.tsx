import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AudioDeepfakeDetection from "./AudioDeepfakeDetection";
import DeepFakeImageVideo from "./DeepFakeImageVideo";

export default function DeepfakeDetection() {
  return (
    <Tabs defaultValue="image-video" className="w-full">
      <TabsList className="grid w-full grid-cols-2 gap-4 mb-8 rounded-lg h-auto bg-slate-800">
        <TabsTrigger
          value="image-video"
          className="p-3 bg-gray-800 text-white hover:bg-gray-700 data-[state=active]:bg-blue-600"
        >
          Image/Video Detection
        </TabsTrigger>
        <TabsTrigger
          value="audio"
          className="p-3 bg-gray-800 text-white hover:bg-gray-700 data-[state=active]:bg-blue-600"
        >
          Audio Detection
        </TabsTrigger>
      </TabsList>

      <TabsContent value="image-video">
        <DeepFakeImageVideo />
      </TabsContent>

      <TabsContent value="audio">
        <AudioDeepfakeDetection />
      </TabsContent>
    </Tabs>
  );
}
