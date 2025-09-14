import Header from '@/components/layout/header';
import TextAnalyzer from '@/components/features/text-analyzer';
import ImageAnalyzer from '@/components/features/image-analyzer';
import UrlAnalyzer from '@/components/features/url-analyzer';
import AudioAnalyzer from '@/components/features/audio-analyzer';
import NewsFeed from '@/components/features/news-feed';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DeepfakeDetector from '@/components/features/deepfake-detector';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Newspaper } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <Header />
      <main className="flex-1 space-y-8 p-4 md:p-8 container mx-auto">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-5 animate-in fade-in-50 duration-500">
          <div className="lg:col-span-3 space-y-8">
            <Card>
              <CardHeader>
                  <CardTitle>Analysis Tools</CardTitle>
                  <CardDescription>Select a tool to analyze content for misinformation.</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="text" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4">
                    <TabsTrigger value="text">Text</TabsTrigger>
                    <TabsTrigger value="image">Image</TabsTrigger>
                    <TabsTrigger value="url">URL</TabsTrigger>
                    <TabsTrigger value="audio">Audio</TabsTrigger>
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
              </CardContent>
            </Card>
          </div>
          <div className="lg:col-span-2">
            <DeepfakeDetector />
          </div>
        </div>

        <div className="animate-in fade-in-50 duration-500 delay-200">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Newspaper />
                Fact-Checked News Feed
              </CardTitle>
              <CardDescription>
                A curated feed of short-form, verified news from India published in the last 48 hours.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <NewsFeed />
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
