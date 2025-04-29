import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TextBroadcast from "./broadcast/textBroadcast";
import VideoBroadcast from "./broadcast/videoBroadcast";

export default function Broadcasts() {
  const [activeTab, setActiveTab] = useState("text");
  console.log(activeTab);

  return (
    <div className="p-8 bg-black min-h-screen">
      <Tabs defaultValue="text" onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="text">Text Broadcast</TabsTrigger>
          <TabsTrigger value="video">Video Broadcast</TabsTrigger>
        </TabsList>

        <TabsContent value="text">
          <TextBroadcast />
        </TabsContent>

        <TabsContent value="video">
          <VideoBroadcast />
        </TabsContent>
      </Tabs>
    </div>
  );
}
