'use client';

import { useState, useRef } from 'react';
import { analyzeImageNewsContent, type AnalyzeImageNewsContentOutput } from '@/ai/flows/analyze-image-news-content';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, FileWarning, BadgeCheck, UploadCloud, Sparkles, Scale, ShieldQuestion, Bot, Wand2 } from 'lucide-react';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { Progress } from '@/components/ui/progress';

const classificationMap = {
    real: {
        icon: BadgeCheck,
        color: 'bg-green-500',
        text: 'Real',
    },
    'AI-generated': {
        icon: Bot,
        color: 'bg-blue-500',
        text: 'AI-Generated',
    },
    manipulated: {
        icon: Wand2,
        color: 'bg-yellow-500',
        text: 'Manipulated',
    },
};

export default function DeepfakeDetector() {
  const [result, setResult] = useState<AnalyzeImageNewsContentOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const { toast } = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      setResult(null);
      setError(null);
    }
  };
  
  const handleSubmit = async () => {
    if (!file || !imagePreview) {
      toast({
        variant: "destructive",
        title: "No Image Selected",
        description: "Please select an image file to analyze.",
      });
      return;
    }

    setLoading(true);
    setResult(null);
    setError(null);
    try {
      const analysisResult = await analyzeImageNewsContent({ photoDataUri: imagePreview });
      setResult(analysisResult);
    } catch (e) {
      setError('An error occurred during analysis. Please try again.');
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const ClassificationIcon = result ? classificationMap[result.classification]?.icon || ShieldQuestion : null;
  const classificationStyle = result ? classificationMap[result.classification] : null;

  return (
    <Card className="w-full h-full border-primary/20 bg-gradient-to-br from-card to-secondary">
        <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2">
                <Sparkles className="text-primary" />
                Deepfake Detector
            </CardTitle>
            <CardDescription>Forensic analysis for AI-generated or manipulated images.</CardDescription>
        </CardHeader>
      <CardContent className="space-y-4">
        <div 
            className="relative flex flex-col items-center justify-center w-full p-4 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50"
            onClick={() => fileInputRef.current?.click()}
        >
            <Input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleFileChange}
            />
            {imagePreview ? (
                <div className="relative w-full max-w-sm">
                    <Image
                        ref={imageRef}
                        src={imagePreview}
                        alt="Image preview"
                        width={400}
                        height={300}
                        onLoad={() => {
                          // Force re-render to draw bounding boxes after image loads
                          if (result) {
                            setResult(JSON.parse(JSON.stringify(result)));
                          }
                        }}
                        className="rounded-md object-contain max-h-48"
                        data-ai-hint="uploaded content"
                    />
                    {result?.tamperedRegions && result.tamperedRegions.map((region, index) => {
                      const image = imageRef.current;
                      if (!image || !image.complete || image.naturalWidth === 0) return null;

                      const naturalWidth = image.naturalWidth;
                      const naturalHeight = image.naturalHeight;
                      
                      const displayWidth = image.clientWidth;
                      const displayHeight = image.clientHeight;

                      // Calculate scale factors
                      const scaleX = displayWidth / naturalWidth;
                      const scaleY = displayHeight / naturalHeight;
                      const scale = Math.min(scaleX, scaleY);

                      const offsetX = (displayWidth - naturalWidth * scale) / 2;
                      const offsetY = (displayHeight - naturalHeight * scale) / 2;

                      const [x_min, y_min, x_max, y_max] = region.box;
                      
                      const left = x_min * scale + offsetX;
                      const top = y_min * scale + offsetY;
                      const width = (x_max - x_min) * scale;
                      const height = (y_max - y_min) * scale;
                      
                      return (
                          <div
                            key={index}
                            className="absolute border-2 border-red-500/80 backdrop-saturate-200"
                            style={{ left, top, width, height }}
                            title={region.description}
                          />
                      );
                    })}
                </div>
            ) : (
                <div className="text-center py-8">
                    <UploadCloud className="w-12 h-12 mx-auto text-muted-foreground" />
                    <p className="mt-2 text-sm text-muted-foreground">Click to upload or drag and drop</p>
                    <p className="text-xs text-muted-foreground">PNG, JPG, GIF up to 10MB</p>
                </div>
            )}
        </div>
        
        <Button onClick={handleSubmit} disabled={loading || !file} className="w-full">
          {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles />}
          Detect Manipulation
        </Button>

        {loading && (
            <div className="flex flex-col items-center justify-center space-y-2 text-center py-4">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-muted-foreground">AI is running forensic analysis...</p>
            </div>
        )}
        {error && (
            <Alert variant="destructive">
                <FileWarning className="h-4 w-4" />
                <AlertTitle>Analysis Failed</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
            </Alert>
        )}
        {result && (
          <div className="space-y-4 animate-in fade-in-50 duration-500">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-lg">
                    {ClassificationIcon && <ClassificationIcon className={`h-5 w-5 text-white ${classificationStyle?.color} rounded-full p-0.5`} />}
                    Result: <Badge variant="outline" className={`border-none text-white ${classificationStyle?.color}`}>{classificationStyle?.text}</Badge>
                </CardTitle>
                 <div className="pt-2">
                    <h3 className="text-xs font-medium text-muted-foreground mb-1">Confidence Score</h3>
                    <div className="flex items-center gap-2">
                        <Progress value={result.confidenceScore} className="w-full h-1.5" />
                        <span className="font-semibold text-xs">{result.confidenceScore}%</span>
                    </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3 text-sm pt-4">
                 <div>
                    <h3 className="font-semibold flex items-center gap-2 mb-1"><Scale className="h-4 w-4 text-primary" />Reasoning</h3>
                    <p className="text-xs text-muted-foreground">{result.reasoning}</p>
                 </div>
                 {result.tamperedRegions && result.tamperedRegions.length > 0 && (
                    <div>
                        <h3 className="font-semibold flex items-center gap-2 mb-1"><Wand2 className="h-4 w-4 text-primary" />Tampered Regions</h3>
                        <p className="text-xs text-muted-foreground">Highlighted areas on the image indicate potential manipulation.</p>
                        <ul className="list-disc list-inside mt-1 space-y-1">
                          {result.tamperedRegions.map((region, index) => (
                            <li key={index} className="text-xs text-muted-foreground">{region.description}</li>
                          ))}
                        </ul>
                    </div>
                 )}
              </CardContent>
            </Card>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
