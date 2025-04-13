import HistoryDashboard from "../components/history-dashboard";
import LiveDashboard from "../components/live-dashboard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"


export default function Home() {
  return (
    <div className='flex flex-col min-h-screen w-full items-center justify-center overflow-hidden'>
      <div className='container mx-auto py-10 max-w-5xl p-5'>
        <h1 className='font-bold text-2xl'>Dashboard</h1>
        <Tabs defaultValue='live' className='h-full'>
          <TabsList>
            <TabsTrigger value='live'>Live</TabsTrigger>
            <TabsTrigger value='history'>History</TabsTrigger>
          </TabsList>
          <TabsContent value='live'>
            <LiveDashboard />
          </TabsContent>
          <TabsContent value='history'>
            <HistoryDashboard />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
