import Header from '@/components/layout/header';
import TextAnalyzer from '@/components/features/text-analyzer';
import ImageAnalyzer from '@/components/features/image-analyzer';
import NewsFeed from '@/components/features/news-feed';
import TrendsDashboard from '@/components/features/trends-dashboard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';

export default function Home() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <Header />
      <main className="flex flex-1 flex-col gap-8 p-4 md:p-8 container mx-auto">
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Tabs defaultValue="text" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="text">Text Analyzer</TabsTrigger>
                <TabsTrigger value="image">Image Analyzer</TabsTrigger>
              </TabsList>
              <TabsContent value="text">
                <TextAnalyzer />
              </TabsContent>
              <TabsContent value="image">
                <ImageAnalyzer />
              </TabsContent>
            </Tabs>
          </div>
          <div className="w-full">
            <TrendsDashboard />
          </div>
        </div>
        
        <Separator />

        <div className="space-y-4">
          <h2 className="text-3xl font-bold tracking-tight">Fact-Checked News Feed</h2>
          <p className="text-muted-foreground">A curated feed of short-form, verified news to keep you accurately informed.</p>
          <NewsFeed />
        </div>
      </main>
    </div>
  );
}
