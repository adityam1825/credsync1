import Header from '@/components/layout/header';
import TextAnalyzer from '@/components/features/text-analyzer';
import ImageAnalyzer from '@/components/features/image-analyzer';
import UrlAnalyzer from '@/components/features/url-analyzer';
import AudioAnalyzer from '@/components/features/audio-analyzer';
import NewsFeed from '@/components/features/news-feed';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import DeepfakeDetector from '@/components/features/deepfake-detector';

export default function Home() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <Header />
      <main className="flex flex-1 flex-col gap-8 p-4 md:p-8 container mx-auto">
        <div className="w-full">
            <Tabs defaultValue="text" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="text">Text Analyzer</TabsTrigger>
                <TabsTrigger value="image">Image Analyzer</TabsTrigger>
                <TabsTrigger value="url">URL Analyzer</TabsTrigger>
                <TabsTrigger value="audio">Audio Analyzer</TabsTrigger>
              </TabsList>
              <TabsContent value="text">
                <TextAnalyzer />
              </TabsContent>
              <TabsContent value="image">
                <ImageAnalyzer />
              </TabsContent>
              <TabsContent value="url">
                <UrlAnalyzer />
              </TabsContent>
              <TabsContent value="audio">
                <AudioAnalyzer />
              </TabsContent>
            </Tabs>
        </div>
        
        <Separator />

        <div className="space-y-4">
            <h2 className="text-3xl font-bold tracking-tight">Deepfake Media Detector</h2>
            <p className="text-muted-foreground">Upload an image to check if it's AI-generated or manipulated. The AI will perform a forensic analysis to detect inconsistencies.</p>
            <DeepfakeDetector />
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
